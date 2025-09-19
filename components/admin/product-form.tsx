
"use client";

import React, { useState, useEffect } from "react";
import type { Product, ProductType as ProductTypeType } from "@/types/product";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProductForm({
  mode = "create",
  initialData,
}: {
  mode?: "create" | "edit";
  initialData?: Partial<Product>;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    currentMarketPricePerKg: initialData?.currentMarketPricePerKg || "",
    farmerMonthlyPayment: initialData?.farmerMonthlyPayment || "",
    productTypeId: initialData?.productTypeId || "",
    durationId: initialData?.durationId || "",
  });
  const [productTypes, setProductTypes] = useState<ProductTypeType[]>([]);
  const [durations, setDurations] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [typesRes, durationsRes] = await Promise.all([
          fetch("/api/product-types"),
          fetch("/api/durations"),
        ]);
        const types = await typesRes.json();
        const durs = await durationsRes.json();
        setProductTypes(types);
        setDurations(durs);
      } catch {
        // Optionally handle error
      }
    }
    fetchOptions();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = mode === "edit" ? "PUT" : "POST";
      const url = mode === "edit" && initialData?.id ? `/api/products/${initialData.id}` : "/api/products";
      const payload = {
        ...form,
        currentMarketPricePerKg: form.currentMarketPricePerKg !== "" ? Number(form.currentMarketPricePerKg) : 0,
        farmerMonthlyPayment: form.farmerMonthlyPayment !== "" ? Number(form.farmerMonthlyPayment) : 0,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        // If error is a Zod error object, show a readable message
        if (data.error && typeof data.error === 'object') {
          const messages = Object.values(data.error).map((v: any) => v?._errors?.join(', ')).filter(Boolean).join(' ');
          throw new Error(messages || 'Failed to save product');
        }
        throw new Error(data.error || "Failed to save product");
      }
      router.push("/admin/products/all");
    } catch (err) {
      if (err instanceof Error) setError(err.message || "Failed to save product");
      else setError("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded shadow"
    >
      <div>
        <label className="block font-medium mb-1">Name</label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label className="block font-medium mb-1">Product Type</label>
        <select
          name="productTypeId"
          value={form.productTypeId}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select product type</option>
          {productTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Duration</label>
        <select
          name="durationId"
          value={form.durationId}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select duration</option>
          {durations.map((dur) => (
            <option key={dur.id} value={dur.id}>
              {dur.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Description</label>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Image URL</label>
        <Input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Market Price Per Kg</label>
        <Input
          name="currentMarketPricePerKg"
          type="number"
          value={form.currentMarketPricePerKg}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Farmer Monthly Payment</label>
        <Input
          name="farmerMonthlyPayment"
          type="number"
          value={form.farmerMonthlyPayment}
          onChange={handleChange}
          required
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? "Saving..."
          : mode === "edit"
          ? "Update Product"
          : "Create Product"}
      </Button>
    </form>
  );
}
