import { getProduct } from "@/lib/services/product-service";
import { Button } from "@/components/ui/button";
import { notFound, redirect } from "next/navigation";

export default async function ProductDeletePage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  if (!product) return notFound();

  async function handleDelete() {
    // TODO: Call API to delete product
    redirect("/admin/products/all");
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Delete Product</h1>
      <p>
        Are you sure you want to delete{" "}
        <span className="font-semibold">{product.name}</span>?
      </p>
      <form action={handleDelete} className="mt-6 flex gap-4">
        <Button type="submit" variant="destructive">
          Delete
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => redirect("/admin/products/all")}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
}
