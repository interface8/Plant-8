import { auth } from "@/auth";
import AdminPreTaskForm from "@/components/admin/pre-tasks/pre-task-form";
import PreTaskTable from "@/components/admin/pre-tasks/pre-task-table";
import PreTaskStats from "@/components/admin/pre-tasks/pre-task-stats";
import { redirect } from "next/navigation";
import prisma from "@/db/prisma";

export default async function AdminPreTasksPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  const products = await prisma.product.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const preTasks = await prisma.preTask.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Tasks Management</h1>
        <p className="text-gray-600">Create and manage pre-tasks for your products.</p>
      </div>
      
      <PreTaskStats preTasks={preTasks} products={products} />
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Pre-Task</h2>
        <AdminPreTaskForm products={products} />
      </div>
      
      <PreTaskTable 
        preTasks={preTasks} 
        products={products}
      />
    </div>
  );
}
