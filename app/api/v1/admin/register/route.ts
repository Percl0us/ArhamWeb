import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
//new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const existinguser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (existinguser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newuser = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
        role: body.role,
        ranking: body.ranking,
        designation: body.designation,
        about: body.about || "",
        imageUrl: body.imageUrl || "",
      },
    });
    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newuser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    const e = error as Error;
    console.log(e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
