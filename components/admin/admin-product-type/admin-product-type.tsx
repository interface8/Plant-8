"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ProductType } from "@/types/product";
import ProductTypeForm from "./product-type-form";
import { Edit2, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminProductTypes() {
  const { data: session, status } = useSession();

  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<null | ProductType>(null);
  const [showForm, setShowForm] = useState(false);
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

  const handleFormSuccess = (productType: ProductType) => {
    setProductTypes((prev) => {
      if (editing) {
        toast.success("Product type updated successfully");
        return prev.map((pt) => (pt.id === productType.id ? productType : pt));
      } else {
        toast.success("Product type added successfully");
        return [...prev, productType];
      }
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (productType: ProductType) => {
    setEditing(productType);
    setShowForm(true);
  };

  const handleDelete = (id: string, name?: string) => {
    toast.custom((t) => (
      <div className="bg-white border border-red-200 rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-center mb-3">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="font-semibold text-gray-900">Confirm Deletion</h3>
        </div>
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete{" "}
          <strong>{name || "this product type"}</strong>? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t);
              await confirmDelete(id);
            }}
            className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const confirmDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/product-types/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product type");
      }
      setProductTypes((prev) => prev.filter((pt) => pt.id !== id));
      toast.success("Product type deleted successfully");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete product type"
      );
      toast.error(err instanceof Error ? err.message : "Failed to delete product type");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="relative mb-4 inline-block">
          <div className="text-4xl animate-bounce">🌱</div>
          <div className="absolute inset-0 text-4xl animate-pulse opacity-50">🌿</div>
        </div>
        <p className="text-gray-600">Loading product types...</p>
      </div>
    </div>
  );
  if (error) return <div className="text-red-600">{error}</div>;
  if (!isAdmin) return <div>Access denied. Admin privileges required.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Product Types</h1>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Product Type
        </button>
      </div>
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
                    Parent: {" "}
                    {pt.prevId
                      ? productTypes.find((p) => p.id === pt.prevId)?.name || "None"
                      : "None"}
                  </p>
                  {pt.children?.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Subcategories: {pt.children.map((c) => c.name).join(", ")}
                    </p>
                  )}
                </div>
                <div className="space-x-2 flex items-center">
                  <button
                    onClick={() => handleEdit(pt)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pt.id, pt.name)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Modal for Add/Edit */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative">
            <ProductTypeForm
              initial={editing ? {
                id: editing.id,
                name: editing.name,
                description: editing.description || "",
                prevId: editing.prevId ?? null,
              } : undefined}
              productTypes={productTypes}
              onSuccess={handleFormSuccess}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => { setShowForm(false); setEditing(null); }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
