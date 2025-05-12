import { isuserauthenticated, userunauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id);
    const post = await prisma.post.findUnique({
      where: { id: id },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  if (!(await isuserauthenticated(request))) {
    return userunauthorized();
  }
  try {
    const id = parseInt(context.params.id);
    const body = await request.json();

    const updatedpost = await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        published: body.published || "false",
        category: body.category || "Misc",
      },
    });
    return NextResponse.json(updatedpost);
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  if (!(await isuserauthenticated(request))) {
    return userunauthorized();
  }
  try {
    const id = parseInt(context.params.id);
    await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Post deleted succesfully" });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
