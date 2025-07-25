import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { investmentSchema } from "@/lib/validators/investment-schema-validators";
import crypto from "crypto";

export async function GET() {
  try {
    const investments = await prisma.investment.findMany({
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
  if (!session?.user) {
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

    const {
      userId,
      productId,
      productTypeId,
      amount,
      expectedReturn,
      progress,
      status,
    } = parsed.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productType = await prisma.productType.findUnique({
      where: { id: productTypeId },
    });
    if (!productType) {
      return NextResponse.json(
        { error: "Product type not found" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const investment = await prisma.investment.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        productId,
        productTypeId,
        amount,
        expectedReturn: expectedReturn ?? 0,
        progress: progress ?? 0,
        status: status ?? "PENDING",
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(investment, { status: 201 });
  } catch (error) {
    console.error("Error creating investment:", error);
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}
