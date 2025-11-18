import React from "react";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/products/ProductForm";
import { BackToListButton } from "@/components/admin/back-to-list-button";

// Fetch product data for edit
async function getProduct(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/products/${id}`
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const product = await getProduct((await params).id);
  if (!product) return notFound();
  return (
    <div className="max-w-2xl mx-auto">
      <BackToListButton href="/admin/products" />
      <h1 className="text-2xl font-bold text-green-800 mb-4">Edit Product</h1>
      <ProductForm mode="edit" initialData={product} />
    </div>
  );
}
