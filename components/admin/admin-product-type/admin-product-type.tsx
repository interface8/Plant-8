"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ProductType } from "@/types/product";
import { productTypeSchema } from "@/lib/validators/product-type-schema-validators";
import { z } from "zod";

export default function AdminProductTypes() {
  const { data: session, status } = useSession();

  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{
    id?: string;
    name: string;
    description: string;
    prevId: string | null;
  }>({ name: "", description: "", prevId: null });
  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.roles?.includes("ADMIN")) {
      setIsAdmin(true);
      fetchProductTypes();
    } else {
      setError("Unauthorized: Admin access required");
      setLoading(false);
    }
  }, [session, status]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    const parsed = productTypeSchema.safeParse(form);
    if (!parsed.success) {
      setFormErrors(parsed.error.issues);
      return;
    }

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
      setProductTypes((prev) =>
        form.id
          ? prev.map((pt) => (pt.id === form.id ? updatedProductType : pt))
          : [...prev, updatedProductType]
      );
      setForm({ name: "", description: "", prevId: null });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save product type"
      );
    }
  };

  const handleEdit = (productType: ProductType) => {
    setForm({
      id: productType.id,
      name: productType.name,
      description: productType.description || "",
      prevId: productType.prevId ?? null,
    });
    setFormErrors([]);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/product-types/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product type");
      }
      setProductTypes((prev) => prev.filter((pt) => pt.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete product type"
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!isAdmin) return <div>Access denied. Admin privileges required.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Product Types</h1>

      {/* Form for Create/Update */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`mt-1 block w-full border border-gray-300 rounded-md p-2 ${
                formErrors.some((e) => e.path.includes("name"))
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formErrors.find((e) => e.path.includes("name")) && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.find((e) => e.path.includes("name"))?.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label
              htmlFor="prevId"
              className="block text-sm font-medium text-gray-700"
            >
              Parent Category
            </label>
            <select
              id="prevId"
              value={form.prevId || ""}
              onChange={(e) =>
                setForm({ ...form, prevId: e.target.value || null })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">None (Top-level Category)</option>
              {productTypes
                .filter((pt) => !pt.prevId)
                .map((pt) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.name}
                  </option>
                ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            {form.id ? "Update" : "Create"} Product Type
          </button>
        </div>
      </form>

      {/* List of Product Types */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Product Types</h2>
        <ul className="space-y-2">
          {productTypes.map((pt) => (
            <li key={pt.id} className="border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{pt.name}</h3>
                  <p className="text-sm text-gray-600">{pt.description}</p>
                  <p className="text-sm text-gray-500">
                    Parent:{" "}
                    {pt.prevId
                      ? productTypes.find((p) => p.id === pt.prevId)?.name ||
                        "None"
                      : "None"}
                  </p>
                  {pt.children?.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Subcategories: {pt.children.map((c) => c.name).join(", ")}
                    </p>
                  )}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(pt)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pt.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
