import { ProductForm } from "@/components/admin/product-form";
import { BackToListButton } from "@/components/admin/back-to-list-button";

export default function ProductNewPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <BackToListButton href="/admin/products" />
      <h1 className="text-2xl font-bold text-green-800 mb-4">Add New Product</h1>
      <ProductForm mode="create" />
    </div>
  );
}
