import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { LocationEditForm } from "@/components/admin/locations";

interface EditLocationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLocationPage({ params }: EditLocationPageProps) {
  const session = await auth();
  
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/admin");
  }

  const { id } = await params;

  // Fetch the location data with state information
  const location = await prisma.location.findUnique({
    where: { id },
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
  });

  if (!location) {
    redirect("/admin/locations");
  }

  // Fetch all states for the dropdown
  const states = await prisma.state.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Location</h1>
          <p className="mt-2 text-gray-600">
            Update the details for &ldquo;{location.name}&rdquo; in {location.state.name}
          </p>
        </div>

        <LocationEditForm location={location} states={states} />
      </div>
    </div>
  );
}