import { isuserauthenticated, userunauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JwtPayload, verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

/*title       String
description String    @db.Text
location    String
startDate   DateTime
endDate     DateTime?
imageUrl    String?
createdAt   DateTime  @default(now())
updatedAt   DateTime  @updatedAt
organizer   User?     @relation(fields: [organizerId], references: [id]) // Event organizer (admin or member)
organizerId Int?

*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    const e = error as Error;
    NextResponse.json({ error: e.message }, { status: 401 });
  }
}
interface custumjwtinterface extends JwtPayload {
  userId: string;
  email: string;
}

const jwtsecret = process.env.JWT_SECRET || "notsecret";
export async function POST(request: NextRequest) {
  if (!(await isuserauthenticated(request))) {
    return userunauthorized();
  }
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verify(token, jwtsecret) as custumjwtinterface;
    const body = await request.json();
    const newevent = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        startDate: body.startDate,
        endDate: body.endDate,
        imageUrl: body.imageUrl,
        organizerId: parseInt(decoded.userId),
      },
    });
    return NextResponse.json(newevent);
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 402 });
  }
}
