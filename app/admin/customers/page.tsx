import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Mail,
  Calendar,
  TrendingUp,
  ArrowLeft,
  DollarSign,
} from "lucide-react";

export default async function CustomersPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { 
          select: { investments: true } 
        },
        investments: {
          select: { 
            amount: true, 
            status: true 
          }
        }
      }
    });

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(date));
    };

    const getUserInvestmentTotal = (investments: { amount: number }[]) => {
      return investments.reduce((sum, inv) => sum + inv.amount, 0);
    };

    const totalUsers = users.length;
    const usersWithInvestments = users.filter(user => user._count.investments > 0).length;
    const totalInvestmentValue = users.reduce((sum, user) => 
      sum + getUserInvestmentTotal(user.investments), 0
    );

    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600 mt-1">
                Manage and view all registered users
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    Active Investors
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {usersWithInvestments}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Investment Value
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalInvestmentValue)}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Investments</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total Value</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const totalValue = getUserInvestmentTotal(user.investments);
                    const isInvestor = user._count.investments > 0;
                    
                    return (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-medium">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name || "Unknown User"}
                              </p>
                              <p className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{formatDate(user.createdAt)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={user._count.investments > 0 ? "default" : "secondary"}>
                            {user._count.investments} investments
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">
                            {totalValue > 0 ? formatCurrency(totalValue) : "-"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant={isInvestor ? "default" : "secondary"}
                            className={isInvestor ? "bg-green-100 text-green-800" : ""}
                          >
                            {isInvestor ? "Investor" : "User"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Customers page error:", error);
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">
            Unable to load customer data. Please check your database connection.
          </p>
        </div>
      </div>
    );
  }
}