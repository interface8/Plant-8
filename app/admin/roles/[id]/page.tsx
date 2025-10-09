import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Shield,
  Users,
  Calendar,
  User,
  Mail,
  Activity,
  Edit,
  Trash2,
  UserMinus,
} from "lucide-react";

interface RoleDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function RoleDetailsPage({ params }: RoleDetailsPageProps) {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  try {
    const role = await prisma.role.findUnique({
      where: { id: params.id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                _count: {
                  select: {
                    investments: true,
                  },
                },
                investments: {
                  select: {
                    amount: true,
                    status: true,
                  },
                  take: 1,
                  orderBy: {
                    createdAt: "desc",
                  },
                },
              },
            },
            assignedByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { assignedAt: "desc" },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        modifiedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: { users: true },
        },
      },
    });

    if (!role) {
      notFound();
    }

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date));
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const isSystemRole = ["ADMIN", "USER"].includes(role.name);

    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/roles" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-gray-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{role.name}</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={isSystemRole ? "default" : "secondary"}>
                      {isSystemRole ? "System Role" : "Custom Role"}
                    </Badge>
                    <span className="text-gray-600">
                      {role._count.users} users assigned
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isSystemRole && (
              <>
                <Button asChild variant="outline">
                  <Link href={`/admin/roles/${role.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Role
                  </Link>
                </Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Role
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Role Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Role Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Role Name</label>
                <p className="text-lg font-semibold text-gray-900">{role.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-gray-900">{formatDate(role.createdAt)}</p>
              </div>
              {role.modifiedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Modified</label>
                  <p className="text-gray-900">{formatDate(role.modifiedAt)}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Created By</label>
                <p className="text-gray-900">
                  {role.createdByUser?.name || "System"}
                </p>
              </div>
              {role.modifiedByUser && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Modified By</label>
                  <p className="text-gray-900">{role.modifiedByUser.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Total Users</label>
                <p className="text-2xl font-bold text-gray-900">{role._count.users}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Active Investors</label>
                <p className="text-xl font-semibold text-green-600">
                  {role.users.filter(ur => ur.user._count.investments > 0).length}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Recent Assignments</label>
                <p className="text-lg text-gray-900">
                  {role.users.filter(ur => 
                    new Date(ur.assignedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length} this week
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="outline">
                <Link href={`/admin/roles?assign=${role.id}`}>
                  <Users className="h-4 w-4 mr-2" />
                  Assign to User
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href={`/admin/customers?role=${role.name}`}>
                  <User className="h-4 w-4 mr-2" />
                  View All Users
                </Link>
              </Button>
              {!isSystemRole && (
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/admin/roles/${role.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Role
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Assigned Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Assigned Users ({role._count.users})
              </div>
              <Button asChild size="sm">
                <Link href={`/admin/roles?assign=${role.id}`}>
                  <Users className="h-4 w-4 mr-2" />
                  Assign User
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {role.users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Assigned At</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Assigned By</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Investments</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {role.users.map((userRole) => {
                      const latestInvestment = userRole.user.investments[0];
                      return (
                        <tr key={userRole.user.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-medium">
                                {userRole.user.name?.charAt(0)?.toUpperCase() || "U"}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {userRole.user.name || "Unknown User"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ID: {userRole.user.id.slice(0, 8)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-900">{userRole.user.email}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-900">
                                {formatDate(userRole.assignedAt)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-900">
                              {userRole.assignedByUser.name}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <Badge variant="secondary">
                                {userRole.user._count.investments} investments
                              </Badge>
                              {latestInvestment && (
                                <p className="text-xs text-gray-600">
                                  Latest: {formatCurrency(latestInvestment.amount)} ({latestInvestment.status})
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/customers/${userRole.user.id}`}>
                                  <User className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users assigned</h3>
                <p className="text-gray-500 mb-4">
                  This role hasn&apos;t been assigned to any users yet.
                </p>
                <Button asChild>
                  <Link href={`/admin/roles?assign=${role.id}`}>
                    <Users className="h-4 w-4 mr-2" />
                    Assign First User
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Role details error:", error);
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">
            Unable to load role details. Please check your database connection.
          </p>
        </div>
      </div>
    );
  }
}