import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { addressSchema } from "@/lib/validators";
import z from "zod";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = addressSchema.parse(body);

    const existingAddress = await prisma.address.findUnique({
      where: { id: id, userId: session.user.id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (validatedData.useAsDelivery) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, useAsDelivery: true },
        data: { useAsDelivery: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: id },
      data: {
        ...validatedData,
        modifiedById: session.user.id,
        modifiedOn: new Date(),
      },
      include: { addressType: true },
    });

    return NextResponse.json({
      ...address,
      modifiedOn: address.modifiedOn?.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("PUT address validation error:", error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("PUT address error:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingAddress = await prisma.address.findUnique({
      where: { id: id, userId: session.user.id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("DELETE address error:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
