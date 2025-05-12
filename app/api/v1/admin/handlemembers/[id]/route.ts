import { adminunauthorized, isadminauthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id);
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  if (!(await isadminauthenticated(request))) {
    return adminunauthorized();
  }
  try {
    const id = parseInt(context.params.id);
    const body = await request.json();

    const updateduser = await prisma.user.update({
      where: { id },
      data: {
        email: body.email,
        password: body.password, // Store hashed passwords only!
        name: body.name || "",
        role: body.role,
        // One-to-many relationship with Post
        // One-to-many relationship with Event
        ranking: body.rankings, // Optional ranking for members
        designation: body.designation, // Optional designation for members
        about: body.about, // Optional about section for members
        imageUrl: body.imageUrl,
      },
    });
    return NextResponse.json(updateduser);
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  if (!(await isadminauthenticated(request))) {
    return adminunauthorized();
  }
  try {
    const id = parseInt(context.params.id);
    await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json({ message: "User deleted succesfully" });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
