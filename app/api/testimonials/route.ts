import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { testimonySchema } from "@/lib/validators";
import { z } from "zod";

export async function GET() {
  try {
    const testimonies = await prisma.testimony.findMany({
      where: { isApproved: true },
      orderBy: { createdOn: "desc" },
      include: {
        createdBy: { select: { name: true } },
        modifiedBy: { select: { name: true } },
      },
    });
    return NextResponse.json(testimonies);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch testimonies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = testimonySchema.parse(body);

    const testimony = await prisma.testimony.create({
      data: {
        ...validatedData,
        createdById: session.user.id,
        modifiedById: session.user.id,
      },
    });
    return NextResponse.json(testimony, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create testimony" },
      { status: 500 }
    );
  }
}
