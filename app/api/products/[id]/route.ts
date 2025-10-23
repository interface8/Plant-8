import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: (await params).id },
      select: {
        id: true,
        name: true,
        description: true,
        productTypeId: true,
        durationId: true,
  images: { select: { url: true } },
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

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
