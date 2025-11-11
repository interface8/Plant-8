import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import StateEditForm from "@/components/admin/states/state-edit-form";

interface EditStatePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStatePage({ params }: EditStatePageProps) {
  const session = await auth();
  
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/admin");
  }

  const { id } = await params;

  // Fetch the state data
  const state = await prisma.state.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          locations: true,
        },
      },
    },
  });

  if (!state) {
    redirect("/admin/states");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit State</h1>
          <p className="mt-2 text-gray-600">
            Update the details for &ldquo;{state.name}&rdquo;
          </p>
        </div>

        <StateEditForm state={state} />
      </div>
    </div>
  );
}