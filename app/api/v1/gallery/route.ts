import { isuserauthenticated, userunauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const images = await prisma.image.findMany({
      orderBy: { rank: "asc" },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.log("Error fetching images");
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 501 });
  }
}
/*
model Image {
  id         Int      @id @default(autoincrement())
  imageUrl   String
  rank       Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  authorName String?
  category   String?
}
 */

export async function POST(request: NextRequest) {
  if (!(await isuserauthenticated(request))) {
    return userunauthorized();
  }
  const body = await request.json();
  try {
    const newimage = await prisma.image.create({
      data: {
        imageUrl: body.imageUrl,
        rank: body.rank,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
        authorName: body.authorName,
        category: body.category,
      },
    });
    return NextResponse.json(newimage);
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
