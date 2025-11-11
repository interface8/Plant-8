import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import LocationForm from "@/components/admin/locations/location-form";

export default async function NewLocationPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  // Fetch all states for the dropdown
  const states = await prisma.state.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Location</h1>
          <p className="mt-2 text-gray-600">
            Create a new location within a state.
          </p>
        </div>

        <LocationForm states={states} />
      </div>
    </div>
  );
}