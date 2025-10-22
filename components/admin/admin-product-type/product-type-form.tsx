"use client";

import { useState } from "react";
import { ProductType } from "@/types/product";
import { productTypeSchema } from "@/lib/validators/product-type-schema-validators";
import { z } from "zod";

interface ProductTypeFormProps {
  initial?: {
    id?: string;
    name: string;
    description: string;
    prevId: string | null;
  };
  productTypes: ProductType[];
  onSuccess: (productType: ProductType) => void;
  onCancel: () => void;
}

export default function ProductTypeForm({
  initial = { name: "", description: "", prevId: null },
  productTypes,
  onSuccess,
  onCancel,
}: ProductTypeFormProps) {
  const [form, setForm] = useState(initial);
  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    setError(null);
    const parsed = productTypeSchema.safeParse(form);
    if (!parsed.success) {
      setFormErrors(parsed.error.issues);
      return;
    }
    setLoading(true);
    try {
      const method = form.id ? "PUT" : "POST";
      const url = form.id
        ? `/api/product-types/${form.id}`
        : "/api/product-types";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          prevId: form.prevId || undefined,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save product type");
      }
      const updatedProductType = await response.json();
      onSuccess(updatedProductType);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save product type"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow">
      <div className="grid gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`mt-1 block w-full border border-gray-300 rounded-md p-2 ${
              formErrors.some((e) => e.path.includes("name")) ? "border-red-500" : ""
            }`}
          />
          {formErrors.find((e) => e.path.includes("name")) && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.find((e) => e.path.includes("name"))?.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="prevId" className="block text-sm font-medium text-gray-700">
            Parent Category
          </label>
          <select
            id="prevId"
            value={form.prevId || ""}
            onChange={(e) => setForm({ ...form, prevId: e.target.value || null })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">None (Top-level Category)</option>
            {productTypes
              .filter((pt) => !pt.prevId || pt.id === form.id)
              .map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.name}
                </option>
              ))}
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            disabled={loading}
          >
            {form.id ? "Update" : "Create"} Product Type
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
