import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { z } from "zod";

const stateSchema = z.object({
  name: z.string().min(1, "State name is required"),
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
    const parsed = stateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, createdBy } = parsed.data;
    if (createdBy !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: Invalid creator ID" },
        { status: 403 }
      );
    }

    const state = await prisma.state.create({
      data: { name, createdBy },
    });

    return NextResponse.json(
      { message: "State created successfully", state },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating state:", error);
    return NextResponse.json(
      { error: "Failed to create state" },
      { status: 500 }
    );
  }
}
