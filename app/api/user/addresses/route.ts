import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { addressSchema } from "@/lib/validators/address-schema-validators";
import { auth } from "@/auth";
import z from "zod";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      include: { addressType: true },
    });

    return NextResponse.json(
      addresses.map((addr) => ({
        ...addr,
        modifiedOn: addr.modifiedAt?.toISOString(),
        addressType: {
          id: addr.addressType.id,
          name: addr.addressType.name,
        },
      }))
    );
  } catch (error) {
    console.error("GET addresses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
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
    const validatedData = addressSchema.parse(body);

    if (validatedData.useAsDelivery) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, useAsDelivery: true },
        data: { useAsDelivery: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        createdBy: session.user.id,
        modifiedBy: session.user.id,
        modifiedAt: new Date(),
      },
      include: { addressType: true },
    });

    return NextResponse.json(
      {
        ...address,
        modifiedOn: address.modifiedAt?.toISOString(),
        addressType: {
          id: address.addressType.id,
          name: address.addressType.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("POST address validation error:", error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("POST address error:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}
