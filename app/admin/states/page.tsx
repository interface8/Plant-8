import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminStatesTable from "@/components/admin/states/admin-states-table";
import StatesStats from "@/components/admin/states/states-stats";

export default async function AdminStatesPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  const states = await prisma.state.findMany({
    include: {
      _count: {
        select: {
          locations: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">States Management</h1>
          <p className="text-gray-600">Manage states and their properties.</p>
        </div>
        
        <Link
          href="/admin/states/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New State
        </Link>
      </div>
      
      <StatesStats states={states} />
      
      <AdminStatesTable states={states} />
    </div>
  );
}