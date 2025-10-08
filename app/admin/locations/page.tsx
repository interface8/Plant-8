import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminLocationsTable from "@/components/admin/locations/admin-locations-table";
import LocationsStats from "@/components/admin/locations/locations-stats";

export default async function AdminLocationsPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  const [locations, states] = await Promise.all([
    prisma.location.findMany({
      include: {
        state: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            lands: true,
          },
        },
      },
      orderBy: [
        { state: { name: "asc" } },
        { name: "asc" }
      ],
    }),
    prisma.state.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Locations Management</h1>
          <p className="text-gray-600">Manage locations within states and their properties.</p>
        </div>
        
        <Link
          href="/admin/locations/new"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Location
        </Link>
      </div>
      
      <LocationsStats locations={locations} states={states} />
      
      <AdminLocationsTable locations={locations} />
    </div>
  );
}