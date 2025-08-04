import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { z } from "zod";

const locationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  stateId: z.string().uuid("Invalid state ID"),
  createdBy: z.string().uuid("Invalid user ID"),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await prisma.userRole.findFirst({
    where: { userId: session.user.id, role: { name: "Admin" } },
  });
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const parsed = locationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, stateId, createdBy } = parsed.data;
    if (createdBy !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: Invalid creator ID" },
        { status: 403 }
      );
    }

    const state = await prisma.state.findUnique({ where: { id: stateId } });
    if (!state) {
      return NextResponse.json({ error: "State not found" }, { status: 404 });
    }

    const location = await prisma.location.create({
      data: { name, stateId, createdBy },
    });

    return NextResponse.json(
      { message: "Location created successfully", location },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating location:", error);
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 }
    );
  }
}
