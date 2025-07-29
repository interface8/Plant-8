import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { investmentSchema } from "@/lib/validators/investment-schema-validators";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const investments = await prisma.investment.findMany({
      where: { userId: session.user.id },
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
        product: { select: { id: true, name: true, imageUrl: true } },
        productType: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(investments, { status: 200 });
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = investmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { userId, productId, productTypeId, amount } = parsed.data;

    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: Invalid user ID" },
        { status: 403 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, productTypeId: true, currentMarketPricePerKg: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (product.productTypeId !== productTypeId) {
      return NextResponse.json(
        { error: "Invalid product type" },
        { status: 400 }
      );
    }

    const expectedReturn = amount * 1.2; // Example: 20% return, adjust as needed

    const investment = await prisma.investment.create({
      data: {
        userId,
        productId,
        productTypeId,
        amount,
        expectedReturn,
        progress: 0,
        status: "PENDING",
        createdBy: session.user.id,
      },
      include: {
        product: { select: { name: true } },
      },
    });

    return NextResponse.json(
      {
        message: "Investment created successfully",
        investment: {
          id: investment.id,
          productName: investment.product.name,
          amount: investment.amount,
          expectedReturn: investment.expectedReturn,
          status: investment.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating investment:", error);
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}
