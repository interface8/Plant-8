import prisma from "@/db/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { productTypeSchema } from "@/lib/validators/product-type-schema-validators";

const updateProductTypeSchema = productTypeSchema.partial();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productType = await prisma.productType.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        productsByType: true,
        productsByClass: true,
        productTypeInvestments: true,
      },
    });

    if (!productType) {
      return NextResponse.json(
        { error: "Product type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(productType);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch product type" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateProductTypeSchema.parse(body);

    const existingProductType = await prisma.productType.findUnique({
      where: { id },
    });
    if (!existingProductType) {
      return NextResponse.json(
        { error: "Product type not found" },
        { status: 404 }
      );
    }

    // Check if name is unique if provided
    if (validatedData.name && validatedData.name !== existingProductType.name) {
      const nameExists = await prisma.productType.findUnique({
        where: { name: validatedData.name },
      });
      if (nameExists) {
        return NextResponse.json(
          { error: "Product type name must be unique" },
          { status: 400 }
        );
      }
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

    const productType = await prisma.productType.update({
      where: { id },
      data: validatedData,
      include: {
        parent: true,
        children: true,
        productsByType: true,
        productsByClass: true,
        productTypeInvestments: true,
      },
    });

    return NextResponse.json(productType);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update product type" },
      { status: 500 }
    );
  }
}

// DELETE ProductType
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (
      !id.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      )
    ) {
      return NextResponse.json(
        { error: "Invalid UUID format" },
        { status: 400 }
      );
    }

    // Check if product type exists
    const existingProductType = await prisma.productType.findUnique({
      where: { id },
    });
    if (!existingProductType) {
      return NextResponse.json(
        { error: "Product type not found" },
        { status: 404 }
      );
    }

    // Check if product type has children or investments
    const hasChildren = await prisma.productType.count({
      where: { prevId: id },
    });
    const hasInvestments = await prisma.investment.count({
      where: { productTypeId: id },
    });

    if (hasChildren > 0 || hasInvestments > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete product type with associated children or investments",
        },
        { status: 400 }
      );
    }

    await prisma.productType.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete product type" },
      { status: 500 }
    );
  }
}
