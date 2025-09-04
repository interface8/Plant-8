import { auth } from "@/auth";
import AdminPreTaskForm from "@/components/admin/pre-tasks/pre-task-form";
import { redirect } from "next/navigation";
import prisma from "@/db/prisma";

export default async function AdminPreTasksPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  const products = await prisma.product.findMany({
    select: { id: true, name: true },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Pre-Task</h1>
      <AdminPreTaskForm products={products} />
    </div>
  );
}
