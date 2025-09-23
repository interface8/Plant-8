"use client";
import React, { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { ProductHeader } from "@/components/admin/products/ProductHeader";
import { ProductTable } from "@/components/admin/products/ProductTable";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const handleAdd = () => router.push("/admin/products/new");

  // Remove product from state after deletion
  const handleProductDeleted = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <ProductHeader onAdd={handleAdd} />
      <ProductTable
        products={products}
        onProductDeleted={handleProductDeleted}
      />
    </div>
  );
}
