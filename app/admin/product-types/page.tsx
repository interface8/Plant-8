import { auth } from "@/auth";
import AdminProductTypes from "@/components/admin/admin-product-type/admin-product-type";
import { redirect } from "next/navigation";

export default async function ProductTypesPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/sign-in");
  }
  return <AdminProductTypes />;
}
