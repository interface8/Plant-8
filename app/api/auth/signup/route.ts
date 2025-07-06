import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/db/prisma";
import { signUpSchema } from "@/lib/validators/auth-schema-validators";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = signUpSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const userRole = await prisma.role.upsert({
      where: { name: "USER" },
      update: {},
      create: {
        name: "USER",
        createdBy: "00000000-0000-0000-0000-000000000000",
      },
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: userRole.id,
        assignedBy: user.id,
      },
    });

    const createdUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const roleNames = createdUser?.roles.map((ur) => ur.role.name);

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: createdUser?.id,
          email: createdUser?.email,
          name: createdUser?.name,
          roles: roleNames,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
