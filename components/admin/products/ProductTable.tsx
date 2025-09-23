/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import { toast } from "sonner";

interface ProductTableProps {
  products: Product[];
  onProductDeleted?: (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onProductDeleted,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEdit = (id: string) => {
    router.push(`/admin/products/edit/${id}`);
  };

  const handleDelete = async (id: string, name: string) => {
    toast(
      (...args: any[]) => {
        const t = args[0];
        return (
          <span>
            Are you sure you want to delete <b>{name}</b>?
            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  background: "#dc2626",
                  color: "white",
                  padding: "6px 16px",
                  borderRadius: 4,
                }}
                onClick={async () => {
                  toast.dismiss(t);
                  setLoading(true);
                  try {
                    const res = await fetch(`/api/admin/products/${id}`, {
                      method: "DELETE",
                    });
                    if (res.ok) {
                      if (onProductDeleted) onProductDeleted(id);
                      toast.success("Product deleted successfully");
                    } else {
                      toast.error("Failed to delete product");
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                Delete
              </button>
              <button
                style={{
                  background: "#e5e7eb",
                  color: "#111",
                  padding: "6px 16px",
                  borderRadius: 4,
                }}
                onClick={() => toast.dismiss(t)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </span>
        );
      },
      { duration: 10000 }
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left align-middle">Name</th>
            <th className="px-4 py-2 text-left align-middle">Type</th>
            <th className="px-4 py-2 text-left align-middle">Duration</th>
            <th className="px-4 py-2 text-left align-middle">Price/Kg</th>
            <th className="px-4 py-2 text-left align-middle">Farmer Payment</th>
            <th className="px-4 py-2 text-left align-middle">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t align-middle">
              <td className="px-4 py-2 align-middle">{product.name}</td>
              <td className="px-4 py-2 align-middle">
                {product.ProductType?.name}
              </td>
              <td className="px-4 py-2 align-middle">
                {product.duration?.name}
              </td>
              <td className="px-4 py-2 align-middle">
                ₦{product.currentMarketPricePerKg}
              </td>
              <td className="px-4 py-2 align-middle">
                ₦{product.farmerMonthlyPayment}
              </td>
              <td className="px-4 py-2 align-middle">
                <button
                  className="text-blue-600 hover:underline cursor-pointer mr-2"
                  type="button"
                  tabIndex={0}
                  onClick={() => handleEdit(product.id)}
                  aria-label={`Edit ${product.name}`}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline cursor-pointer"
                  type="button"
                  tabIndex={0}
                  onClick={() => handleDelete(product.id, product.name)}
                  aria-label={`Delete ${product.name}`}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
