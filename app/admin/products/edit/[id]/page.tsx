import { getProduct } from "@/lib/services/product-service";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export default async function ProductEditPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  if (!product) return notFound();
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm mode="edit" initialData={product} />
    </div>
  );
}
