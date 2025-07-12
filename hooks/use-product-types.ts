"use client";

import { useState, useEffect } from "react";
import { ProductType } from "@/types/product";

interface UseProductTypesOptions {
  category?: string;
  parentId?: string;
  durationId?: string;
}

export function useProductTypes(options: UseProductTypesOptions = {}) {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.category) params.append("category", options.category);
      if (options.parentId) params.append("parentId", options.parentId);
      if (options.durationId) params.append("durationId", options.durationId);

      const response = await fetch(`/api/product-types?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch product types");

      const data = await response.json();
      setProductTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.category, options.parentId, options.durationId]);

  return { productTypes, loading, error, refetch: fetchProductTypes };
}
