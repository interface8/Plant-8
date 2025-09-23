import React from "react";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/products/ProductForm";

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
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  if (!product) return notFound();
  return <ProductForm mode="edit" initialData={product} />;
}
