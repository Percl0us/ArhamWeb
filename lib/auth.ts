import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";
import { JwtPayload, verify } from "jsonwebtoken";
import { UserRole } from "@/app/generated/prisma";
const jwtsecret = process.env.JWT_SECRET || "notsecret";
interface custumjwtinterface extends JwtPayload {
  userId: string;
  email: string;
}

export async function isadminauthenticated(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verify(token, jwtsecret) as custumjwtinterface;
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        role: UserRole.ADMIN,
      },
    });
    return !!user;
  } catch (error) {
    console.log("Auth Error", error);
    return false;
  }
}
export function adminunauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
export async function isuserauthenticated(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verify(token, jwtsecret) as custumjwtinterface;
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
      },
    });
    return !!user;
  } catch (error) {
    console.log("Auth Error", error);
    return false;
  }
}
export function userunauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
