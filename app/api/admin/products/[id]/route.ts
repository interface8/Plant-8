import { NextRequest, NextResponse } from "next/server";
import {
  getProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/services/product-service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const product = await getProduct((await params).id);
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await req.json();
    const updated = await updateProduct((await params).id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await deleteProduct((await params).id);
  return NextResponse.json({ success: true });
}
