import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { productTypeSchema } from "@/lib/validators/product-type-schema-validators";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productType = await prisma.productType.findUnique({
      where: { id: params.id },
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

    if (!productType) {
      return NextResponse.json(
        { error: "Product type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(productType, { status: 200 });
  } catch (error) {
    console.error("Error fetching product type:", error);
    return NextResponse.json(
      { error: "Failed to fetch product type" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const productType = await prisma.productType.update({
      where: { id: params.id },
      data: {
        name,
        description,
        prevId,
        modifiedBy: session.user.id,
      },
    });

    return NextResponse.json(productType, { status: 200 });
  } catch (error) {
    console.error("Error updating product type:", error);
    return NextResponse.json(
      { error: "Failed to update product type" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const productType = await prisma.productType.findUnique({
      where: { id: params.id },
      include: {
        children: { select: { id: true } },
        products: { select: { id: true } },
      },
    });

    if (!productType) {
      return NextResponse.json(
        { error: "Product type not found" },
        { status: 404 }
      );
    }

    if (productType.children.length > 0 || productType.products.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete product type with children or products" },
        { status: 400 }
      );
    }

    await prisma.productType.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Product type deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product type:", error);
    return NextResponse.json(
      { error: "Failed to delete product type" },
      { status: 500 }
    );
  }
}
