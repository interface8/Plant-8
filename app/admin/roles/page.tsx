import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Shield,
  Users,
  Settings,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { RoleManager } from "@/components/admin/roles/role-manager";

export default async function RolesPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  try {
    const [roles, totalUsers, totalRoles] = await Promise.all([
      prisma.role.findMany({
        include: {
          _count: {
            select: { users: true },
          },
          users: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            take: 5, // Show first 5 users for preview
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.user.count(),
      prisma.role.count(),
    ]);

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(date));
    };

    const getRoleBadgeColor = (roleName: string) => {
      switch (roleName) {
        case "ADMIN":
          return "bg-red-100 text-red-800";
        case "USER":
          return "bg-blue-100 text-blue-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const isSystemRole = (roleName: string) => {
      return ["ADMIN", "USER"].includes(roleName);
    };

    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
              <p className="text-gray-600 mt-1">
                Manage user roles and permissions
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/admin/roles/new" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Role</span>
            </Link>
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Roles
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalRoles}
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
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalUsers}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    System Roles
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {roles.filter(role => isSystemRole(role.name)).length}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role Management Component */}
        <RoleManager initialRoles={roles} />

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card key={role.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <span>{role.name}</span>
                  </CardTitle>
                  <Badge className={getRoleBadgeColor(role.name)}>
                    {isSystemRole(role.name) ? "System" : "Custom"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>{role._count.users}</strong> users assigned
                  </p>
                  
                  {role.users.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Recent Users
                      </p>
                      {role.users.slice(0, 3).map((userRole) => (
                        <div key={userRole.user.id} className="flex items-center space-x-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            {userRole.user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {userRole.user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {userRole.user.email}
                            </p>
                          </div>
                        </div>
                      ))}
                      {role._count.users > 3 && (
                        <p className="text-xs text-gray-500">
                          +{role._count.users - 3} more users
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t space-y-2">
                  <p className="text-xs text-gray-500">
                    Created: {formatDate(role.createdAt)}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/admin/roles/${role.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    {!isSystemRole(role.name) && (
                      <>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/roles/${role.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {roles.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first custom role.
              </p>
              <Button asChild>
                <Link href="/admin/roles/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Role
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error("Roles page error:", error);
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">
            Unable to load role data. Please check your database connection.
          </p>
        </div>
      </div>
    );
  }
}