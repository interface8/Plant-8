import { ProductForm } from "@/components/admin/product-form";

export default function ProductNewPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <ProductForm mode="create" />
    </div>
  );
}
