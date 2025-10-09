import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { z } from "zod";

const assignRoleSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  roleId: z.string().uuid("Invalid role ID"),
});

const removeRoleSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  roleId: z.string().uuid("Invalid role ID"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.roles?.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = assignRoleSchema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: validatedData.roleId },
    });

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Check if user already has this role
    const existingUserRole = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: validatedData.userId,
          roleId: validatedData.roleId,
        },
      },
    });

    if (existingUserRole) {
      return NextResponse.json(
        { error: "User already has this role" },
        { status: 400 }
      );
    }

    const userRole = await prisma.userRole.create({
      data: {
        userId: validatedData.userId,
        roleId: validatedData.roleId,
        assignedBy: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(userRole, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error assigning role:", error);
    return NextResponse.json(
      { error: "Failed to assign role" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.roles?.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = removeRoleSchema.parse(body);

    // Check if user role assignment exists
    const existingUserRole = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: validatedData.userId,
          roleId: validatedData.roleId,
        },
      },
      include: {
        role: true,
      },
    });

    if (!existingUserRole) {
      return NextResponse.json(
        { error: "User role assignment not found" },
        { status: 404 }
      );
    }

    // Prevent removing the last admin role
    if (existingUserRole.role.name === "ADMIN") {
      const adminCount = await prisma.userRole.count({
        where: {
          role: { name: "ADMIN" },
        },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the last admin role" },
          { status: 400 }
        );
      }
    }

    await prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId: validatedData.userId,
          roleId: validatedData.roleId,
        },
      },
    });

    return NextResponse.json({ message: "Role removed successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error removing role:", error);
    return NextResponse.json(
      { error: "Failed to remove role" },
      { status: 500 }
    );
  }
}