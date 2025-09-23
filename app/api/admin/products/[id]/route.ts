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
  const data = await req.json();
  const updated = await updateProduct((await params).id, data);
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await deleteProduct((await params).id);
  return NextResponse.json({ success: true });
}
