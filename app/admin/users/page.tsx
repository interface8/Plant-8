import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { Eye } from "lucide-react";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">User Management</h1>
        <p className="text-gray-600 mb-8">
          This section is under development. User management features will be available soon.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Eye className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}