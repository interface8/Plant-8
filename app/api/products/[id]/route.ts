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
        farmerMonthlyPayment: true,
        roi: true,
        estimatedHarvestQuantityPerPlot: true,
        daysToHarvestPerPlot: true,
        minimumNoOfFarmersPerPlot: true,
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

    // Convert images from array of objects to array of strings
    const images = Array.isArray(product.images)
      ? product.images.map((img: { url: string }) => img.url)
      : [];

    return NextResponse.json({ ...product, images }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
