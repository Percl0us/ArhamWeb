import { isuserauthenticated, userunauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
//Get requests
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

//post new requests

export async function POST(request: NextRequest) {
  if (!(await isuserauthenticated(request))) {
    return userunauthorized();
  }
  try {
    const body = await request.json();
    const newpost = await prisma.post.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        published: body.published || false,
        authorId: body.authorId,
        category: body.category,
      },
    });
    return NextResponse.json(newpost, { status: 201 });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
