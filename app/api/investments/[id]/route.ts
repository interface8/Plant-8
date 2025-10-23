import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const investment = await prisma.investment.findUnique({
      where: { id: (await params).id },
      select: {
        id: true,
        userId: true,
        productId: true,
        productTypeId: true,
        amount: true,
        expectedReturn: true,
        progress: true,
        status: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
  product: { select: { id: true, name: true, images: { select: { url: true } } } },
        productType: { select: { id: true, name: true } },
      },
    });

    if (!investment) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    // Build a clean API response with productImages: string[]
    if (investment && investment.product) {
      const imgs = Array.isArray(investment.product.images)
        ? investment.product.images.map((img: { url: string }) => img.url)
        : [];
      const response = {
        id: investment.id,
        userId: investment.userId,
        productId: investment.productId,
        productTypeId: investment.productTypeId,
        amount: investment.amount,
        expectedReturn: investment.expectedReturn,
        progress: investment.progress,
        status: investment.status,
        createdAt: investment.createdAt,
        user: investment.user,
        product: {
          id: investment.product.id,
          name: investment.product.name,
        },
        productType: investment.productType,
        productImages: imgs,
      };
      return NextResponse.json(response, { status: 200 });
    }
    return NextResponse.json(investment, { status: 200 });
  } catch (error) {
    console.error("Error fetching investment:", error);
    return NextResponse.json(
      { error: "Failed to fetch investment" },
      { status: 500 }
    );
  }
}
