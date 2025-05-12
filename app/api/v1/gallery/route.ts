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
