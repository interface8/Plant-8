/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { userUpdateSchema } from "@/lib/validators";
import bcrypt from "bcryptjs";
import z from "zod";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: { include: { role: true } },
        addresses: { include: { addressType: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      roles: user.roles.map((r) => r.role.name),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      modifiedById: user.modifiedById,
      modifiedOn: user.modifiedOn?.toISOString(),
      addresses: user.addresses.map((addr) => ({
        ...addr,
        modifiedOn: addr.modifiedOn?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = userUpdateSchema.parse(body);

    if (body.email) {
      return NextResponse.json(
        { error: "Email cannot be updated" },
        { status: 400 }
      );
    }

    const data: any = {
      name: validatedData.name,
      modifiedById: session.user.id,
      modifiedOn: new Date(),
    };

    if (validatedData.password) {
      data.password = await bcrypt.hash(validatedData.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      include: {
        roles: { include: { role: true } },
        addresses: { include: { addressType: true } },
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      roles: user.roles.map((r) => r.role.name),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      modifiedById: user.modifiedById,
      modifiedOn: user.modifiedOn?.toISOString(),
      addresses: user.addresses.map((addr) => ({
        ...addr,
        modifiedOn: addr.modifiedOn?.toISOString(),
      })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("PUT profile validation error:", error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("PUT profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
