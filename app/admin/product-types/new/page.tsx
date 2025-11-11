"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";
import ProductTypeForm from "@/components/admin/admin-product-type/product-type-form";
import { useRouter } from "next/navigation";

export default function NewProductTypePage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await fetch("/api/product-types");
        if (!response.ok) throw new Error("Failed to fetch product types");
        const data = await response.json();
        setProductTypes(data);
      } catch (err) {
        setError("Failed to load product types");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductTypes();
  }, []);

  const handleSuccess = () => {
    router.push("/admin/product-types");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Product Type</h1>
      <ProductTypeForm
        productTypes={productTypes}
        onSuccess={handleSuccess}
        onCancel={() => router.push("/admin/product-types")}
      />
    </div>
  );
}
