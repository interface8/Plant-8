import { NextRequest, NextResponse } from "next/server";
import {
  getProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/services/product-service";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await getProduct(params.id);
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const updated = await updateProduct(params.id, data);
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await deleteProduct(params.id);
  return NextResponse.json({ success: true });
}
