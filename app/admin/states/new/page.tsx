import { redirect } from "next/navigation";
import { auth } from "@/auth";
import StateForm from "@/components/admin/states/state-form";
import { BackToListButton } from "@/components/admin/back-to-list-button";

export default async function NewStatePage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <BackToListButton href="/admin/states" />
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-green-800">Add New State</h1>
          <p className="mt-2 text-green-700">
            Create a new state to organize your locations.
          </p>
        </div>

        <StateForm />
      </div>
    </div>
  );
}