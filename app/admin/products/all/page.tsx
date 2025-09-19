/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProducts } from "@/lib/services/product-service";
import Link from "next/link";

export default async function ProductsAllPage() {
  const products = await getProducts();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
        >
          Add Product
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Duration</th>
              <th className="px-4 py-2 border">Price/Kg</th>
              <th className="px-4 py-2 border">Monthly Payment</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id}>
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border">
                  {product.ProductType?.name}
                </td>
                <td className="px-4 py-2 border">{product.duration?.name}</td>
                <td className="px-4 py-2 border">
                  ₦{product.currentMarketPricePerKg}
                </td>
                <td className="px-4 py-2 border">
                  ₦{product.farmerMonthlyPayment}
                </td>
                <td className="px-4 py-2 border space-x-2">
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/products/delete/${product.id}`}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
