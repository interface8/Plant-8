import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { productSchema } from "@/lib/validators/product-schema-validation";
import crypto from "crypto";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        productTypeId: true,
        durationId: true,
        imageUrl: true,
        currentMarketPricePerKg: true,
        ProductType: {
          select: {
            id: true,
            name: true,
          },
        },
        duration: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
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
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      name,
      description,
      productTypeId,
      durationId,
      imageUrl,
      currentMarketPricePerKg,
    } = parsed.data;

    const productType = await prisma.productType.findUnique({
      where: { id: productTypeId },
    });
    if (!productType) {
      return NextResponse.json(
        { error: "Product type not found" },
        { status: 404 }
      );
    }

    const duration = await prisma.duration.findUnique({
      where: { id: durationId },
    });
    if (!duration) {
      return NextResponse.json(
        { error: "Duration not found" },
        { status: 404 }
      );
    }

    const product = await prisma.product.create({
      data: {
        id: crypto.randomUUID(),
        name,
        description,
        productTypeId,
        durationId,
        imageUrl,
        currentMarketPricePerKg,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
