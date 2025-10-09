import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { z } from "zod";

const updateRoleSchema = z.object({
  name: z.string().min(1, "Role name is required").max(50, "Role name too long"),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.roles?.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateRoleSchema.parse(body);
    const { id } = params;

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Prevent updating system roles
    if (["ADMIN", "USER"].includes(existingRole.name)) {
      return NextResponse.json(
        { error: "Cannot update system roles" },
        { status: 400 }
      );
    }

    // Check if new name already exists (excluding current role)
    const nameExists = await prisma.role.findFirst({
      where: {
        name: validatedData.name.toUpperCase(),
        NOT: { id },
      },
    });

    if (nameExists) {
      return NextResponse.json(
        { error: "Role name already exists" },
        { status: 400 }
      );
    }

    const role = await prisma.role.update({
      where: { id },
      data: {
        name: validatedData.name.toUpperCase(),
        modifiedBy: session.user.id,
        modifiedAt: new Date(),
      },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    return NextResponse.json(role);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.roles?.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
      include: {
        _count: { select: { users: true } },
      },
    });

    if (!existingRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Prevent deleting system roles
    if (["ADMIN", "USER"].includes(existingRole.name)) {
      return NextResponse.json(
        { error: "Cannot delete system roles" },
        { status: 400 }
      );
    }

    // Check if role is assigned to users
    if (existingRole._count.users > 0) {
      return NextResponse.json(
        { error: "Cannot delete role that is assigned to users" },
        { status: 400 }
      );
    }

    await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "Failed to delete role" },
      { status: 500 }
    );
  }
}