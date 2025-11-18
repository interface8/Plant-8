import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { LandEditForm } from "@/components/admin/lands";
import { BackToListButton } from "@/components/admin/back-to-list-button";

interface EditLandPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLandPage({ params }: EditLandPageProps) {
  const session = await auth();
  
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/admin");
  }

  const { id } = await params;

  // Fetch the land data
  const land = await prisma.land.findUnique({
    where: { id },
    include: {
      location: {
        include: {
          state: true,
        },
      },
    },
  });

  if (!land) {
    redirect("/admin/lands");
  }

  const locations = await prisma.location.findMany({
    include: {
      state: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <BackToListButton href="/admin/lands" />
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-green-800">Edit Land</h1>
          <p className="mt-2 text-green-700">
            Update the details for &ldquo;{land.name}&rdquo;
          </p>
        </div>

        <LandEditForm land={land} locations={locations} />
      </div>
    </div>
  );
}