import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { productTypeSchema } from "@/lib/validators/product-type-schema-validators";
import crypto from "crypto";

export async function GET() {
  try {
    const productTypes = await prisma.productType.findMany({
      include: {
        children: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
    return NextResponse.json(productTypes, { status: 200 });
  } catch (error) {
    console.error("Error fetching product types:", error);
    return NextResponse.json(
      { error: "Failed to fetch product types" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = productTypeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, description, prevId } = parsed.data;

    if (prevId) {
      const parent = await prisma.productType.findUnique({
        where: { id: prevId },
      });
      if (!parent) {
        return NextResponse.json(
          { error: "Parent product type not found" },
          { status: 404 }
        );
      }
    }

    const productType = await prisma.productType.create({
      data: {
        id: crypto.randomUUID(),
        name,
        description,
        prevId,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(productType, { status: 201 });
  } catch (error) {
    console.error("Error creating product type:", error);
    return NextResponse.json(
      { error: "Failed to create product type" },
      { status: 500 }
    );
  }
}
