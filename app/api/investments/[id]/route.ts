import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const investment = await prisma.investment.findUnique({
      where: { id: params.id },
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
        product: { select: { id: true, name: true, imageUrl: true } },
        productType: { select: { id: true, name: true } },
      },
    });

    if (!investment) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
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
