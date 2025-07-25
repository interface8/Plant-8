import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: { productTypeId: string } }
) {
  try {
    const products = await prisma.product.findMany({
      where: { productTypeId: params.productTypeId },
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
    console.error("Error fetching products by product type:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
