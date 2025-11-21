import { auth } from "@/auth";
import PreTasksPageClient from "@/components/admin/pre-tasks/pre-tasks-page-client";
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
    <PreTasksPageClient 
      initialPreTasks={preTasks}
      products={products}
    />
  );
}
