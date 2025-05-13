import { isuserauthenticated, userunauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JwtPayload, verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id);
    const event = await prisma.event.findUnique({
      where: { id: id },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
interface custumjwtinterface extends JwtPayload {
  userId: string;
  email: string;
}
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  if (!(await isuserauthenticated(request))) {
    return userunauthorized();
  }
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return false;
  }
  const jwtsecret = process.env.JWT_SECRET || "notsecret";
  const token = authHeader.split(" ")[1];
  try {
    const id = parseInt(context.params.id);
    const body = await request.json();
    const decoded = verify(token, jwtsecret) as custumjwtinterface;
    const updatedevent = await prisma.event.update({
      where: { id },
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
    return NextResponse.json(updatedevent);
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
    await prisma.event.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Event deleted succesfully" });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
