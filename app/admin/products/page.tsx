"use client";
import React, { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { ProductTable } from "@/components/admin/products/ProductTable";
import { ProductStats } from "@/components/admin/products/ProductStats";
import Link from "next/link";
import { Plus } from "lucide-react";

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

  // Remove product from state after deletion
  const handleProductDeleted = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Products Management</h1>
          <p className="text-green-700">Manage agricultural products and their details.</p>
        </div>
        
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Product
        </Link>
      </div>
      
      <ProductStats products={products} />
      
      <ProductTable
        products={products}
        onProductDeleted={handleProductDeleted}
      />
    </div>
  );
}
