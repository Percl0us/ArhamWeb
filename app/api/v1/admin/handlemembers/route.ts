import { adminunauthorized, isadminauthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
//Get requests
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { ranking: "asc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

//add new members

export async function POST(request: NextRequest) {
  if (!(await isadminauthenticated(request))) {
    return adminunauthorized();
  }
  try {
    const body = await request.json();
    const newuser = await prisma.user.create({
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
    return NextResponse.json(newuser, { status: 201 });
  } catch (error) {
    console.log("Error creating in newuser");
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
