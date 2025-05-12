import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";
import { JwtPayload, verify } from "jsonwebtoken";
const jwtsecret = process.env.JWT_SECRET || "notsecret";
interface custumjwtinterface extends JwtPayload {
  userId: string;
  email: string;
}
export async function isauthenticated(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verify(token, jwtsecret) as custumjwtinterface;
    const admin = await prisma.admin.findFirst({
      where: {
        id: decoded.userId,
      },
    });
    return !!admin;
  } catch (error) {
    console.log("Auth Error", error);
    return false;
  }
}
export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
