import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const jwtsecret = process.env.JWT_SECRET || "notkey";
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 }
      );
    }
    const token = sign({ userId: user.id, email: user.email }, jwtsecret, {
      expiresIn: "7d",
    });
    NextResponse.json({ token });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
