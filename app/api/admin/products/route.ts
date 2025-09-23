/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/services/product-service";

export async function GET(_req: NextRequest) {
  // TODO: Add filtering, sorting, pagination from query params
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const product = await createProduct(data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create product",
      },
      { status: 400 }
    );
  }
}
