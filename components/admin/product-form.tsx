"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
// Zod schema for client-side validation
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Invalid image URL").min(1, "Image URL is required"),
  currentMarketPricePerKg: z
    .string()
    .min(1, "Market price is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Market price must be a non-negative number"
    ),
  farmerMonthlyPayment: z
    .string()
    .min(1, "Farmer monthly payment is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Farmer monthly payment must be a non-negative number"
    ),
  productTypeId: z.string().uuid("Product type is required"),
  durationId: z.string().uuid("Duration is required"),
});
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
  const [durations, setDurations] = useState<{ id: string; name: string }[]>(
    []
  );
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    // Client-side validation
    const result = formSchema.safeParse(form);
    if (!result.success) {
      const fieldErrorsObj = result.error.formErrors.fieldErrors as Record<string, string[]>;
      const errors: Record<string, string> = {};
      (Object.keys(fieldErrorsObj) as Array<keyof typeof fieldErrorsObj>).forEach((key) => {
        const val = fieldErrorsObj[key];
        if (val && val.length > 0) errors[key] = val[0];
      });
      setFieldErrors(errors);
      toast("Validation Error: Please fix the errors in the form.");
      return;
    }
    setLoading(true);
  toast("Submitting... Please wait while we save your product.");
    try {
      const method = mode === "edit" ? "PUT" : "POST";
      const url =
        mode === "edit" && initialData?.id
          ? `/api/products/${initialData.id}`
          : "/api/products";
      const payload = {
        ...form,
        currentMarketPricePerKg: Number(form.currentMarketPricePerKg),
        farmerMonthlyPayment: Number(form.farmerMonthlyPayment),
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.error && typeof data.error === "object") {
          const messages = Object.values(data.error)
            .map((v) => (Array.isArray((v as { _errors?: string[] })._errors) ? (v as { _errors: string[] })._errors.join(", ") : ""))
            .filter(Boolean)
            .join(" ");
          throw new Error(messages || "Failed to save product");
        }
        throw new Error(data.error || "Failed to save product");
      }
  toast("Product saved successfully.");
      router.push("/admin/products/all");
    } catch (err) {
      if (err instanceof Error)
        setError(err.message || "Failed to save product");
      else setError("Failed to save product");
  toast(err instanceof Error ? err.message : "Failed to save product");
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
        {fieldErrors.name && (
          <div className="text-red-600 text-xs mt-1">{fieldErrors.name}</div>
        )}
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
        {fieldErrors.productTypeId && (
          <div className="text-red-600 text-xs mt-1">
            {fieldErrors.productTypeId}
          </div>
        )}
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
        {fieldErrors.durationId && (
          <div className="text-red-600 text-xs mt-1">
            {fieldErrors.durationId}
          </div>
        )}
      </div>
      <div>
        <label className="block font-medium mb-1">Description</label>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        {fieldErrors.description && (
          <div className="text-red-600 text-xs mt-1">
            {fieldErrors.description}
          </div>
        )}
      </div>
      <div>
        <label className="block font-medium mb-1">Image URL</label>
        <Input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          required
        />
        {fieldErrors.imageUrl && (
          <div className="text-red-600 text-xs mt-1">
            {fieldErrors.imageUrl}
          </div>
        )}
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
        {fieldErrors.currentMarketPricePerKg && (
          <div className="text-red-600 text-xs mt-1">
            {fieldErrors.currentMarketPricePerKg}
          </div>
        )}
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
        {fieldErrors.farmerMonthlyPayment && (
          <div className="text-red-600 text-xs mt-1">
            {fieldErrors.farmerMonthlyPayment}
          </div>
        )}
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
