import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ durationId: string }> }
) {
  try {
    const products = await prisma.product.findMany({
      where: { durationId: (await params).durationId },
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
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products by duration:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
