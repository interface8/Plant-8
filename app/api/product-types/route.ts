import prisma from "@/db/prisma";
import { productTypeSchema } from "@/lib/validators/product-type-schema-validators";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const productTypes = await prisma.productType.findMany({
      include: {
        children: true,
      },
    });

    return NextResponse.json(productTypes);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch product types" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = productTypeSchema.parse(body);

    // Check if name is unique
    const existingProductType = await prisma.productType.findUnique({
      where: { name: validatedData.name },
    });
    if (existingProductType) {
      return NextResponse.json(
        { error: "Product type name must be unique" },
        { status: 400 }
      );
    }

    // Check if prevId exists if provided
    if (validatedData.prevId) {
      const parentExists = await prisma.productType.findUnique({
        where: { id: validatedData.prevId },
      });
      if (!parentExists) {
        return NextResponse.json(
          { error: "Parent product type not found" },
          { status: 400 }
        );
      }
    }

    const productType = await prisma.productType.create({
      data: {
        ...validatedData,
        createdAt: new Date(),
      },
      include: {
        parent: true,
        children: true,
        productsByType: true,
        productsByClass: true,
        productTypeInvestments: true,
      },
    });
    return NextResponse.json(productType, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create product type" },
      { status: 500 }
    );
  }
}
