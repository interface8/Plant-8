import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { testimonySchema } from "@/lib/validators";
import z from "zod";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimony = await prisma.testimony.findUnique({
      where: { id: id },
      include: {
        createdBy: { select: { name: true } },
        modifiedBy: { select: { name: true } },
      },
    });
    if (!testimony) {
      return NextResponse.json(
        { error: "Testimony not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(testimony);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch testimony" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = testimonySchema.parse(body);
    const { id } = await params;
    const testimony = await prisma.testimony.update({
      where: { id: id },
      data: {
        ...validatedData,
        modifiedById: session.user.id,
      },
    });
    return NextResponse.json(testimony);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update testimony" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await prisma.testimony.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: "Testimony deleted successfully" });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete testimony" },
      { status: 500 }
    );
  }
}
