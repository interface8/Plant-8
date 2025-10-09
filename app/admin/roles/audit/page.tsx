import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Activity,
  Shield,
  Users,
  Clock,
} from "lucide-react";


export default async function RoleAuditPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/roles" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role Audit Log</h1>
            <p className="text-gray-600 mt-1">
              Track all role assignments and modifications
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Activities
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  Loading...
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Role Assignments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  Loading...
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Roles Created
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  Loading...
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Recent Activities
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  Loading...
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Component */}
      <Card>
        <CardContent className="p-12 text-center">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Audit Log Coming Soon</h3>
          <p className="text-gray-500">
            Role audit logging functionality will be available in the next update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}