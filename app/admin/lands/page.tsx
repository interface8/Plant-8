import { auth } from "@/auth";
import { AdminLandTable, LandStats } from "@/components/admin/lands";
import { redirect } from "next/navigation";
import prisma from "@/db/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminLandsPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  const lands = await prisma.land.findMany({
    include: {
      location: {
        select: {
          id: true,
          name: true,
          state: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lands Management</h1>
          <p className="text-gray-600">Manage agricultural lands and their properties.</p>
        </div>
        
        <Link
          href="/admin/lands/new"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Land
        </Link>
      </div>
      
      <LandStats lands={lands} />
      
      <AdminLandTable 
        lands={lands} 
      />
    </div>
  );
}