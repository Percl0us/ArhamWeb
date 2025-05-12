import { isuserauthenticated, userunauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id);
    const image = await prisma.image.findUnique({
      where: { id: id },
    });
    if (!image) {
      return NextResponse.json({ error: "image not found" }, { status: 404 });
    }
    return NextResponse.json(image);
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

    const updatedImage = await prisma.image.update({
      where: { id },
      data: {
        imageUrl: body.imageUrl,
        rank: body.rank,
        authorName: body.authorName || "Admin",
        category: body.category || "Misc",
      },
    });
    return NextResponse.json(updatedImage);
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
    await prisma.image.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Image deleted succesfully" });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
