import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Package,
  MapPin,
  Building,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Plus,
  BarChart3,
} from "lucide-react";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  try {
    // Fetch real dashboard data from database
    const [
      totalUsers,
      totalInvestments,
      totalProducts,
      totalLands,
      totalStates,
      totalLocations,
      investmentStats,
      recentInvestments,
      topProducts,
      totalInvestmentValue
    ] = await Promise.all([
      // Basic counts
      prisma.user.count(),
      prisma.investment.count(),
      prisma.product.count(),
      prisma.land.count(),
      prisma.state.count(),
      prisma.location.count(),

      // Investment status breakdown
      prisma.investment.groupBy({
        by: ["status"],
        _count: { _all: true },
        _sum: { amount: true }
      }),

      // Recent investments
      prisma.investment.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
          product: { select: { name: true } }
        }
      }),

      // Top products by investment count
      prisma.product.findMany({
        take: 5,
        include: {
          _count: { select: { investments: true } }
        },
        orderBy: {
          investments: { _count: "desc" }
        }
      }),

      // Total investment value
      prisma.investment.aggregate({
        _sum: { amount: true }
      })
    ]);

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

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "PENDING": return Clock;
        case "ACTIVE": return Activity;
        case "COMPLETED": return CheckCircle;
        case "FAILED": return XCircle;
        default: return Activity;
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case "PENDING": return { text: "text-yellow-600", bg: "bg-yellow-50" };
        case "ACTIVE": return { text: "text-blue-600", bg: "bg-blue-50" };
        case "COMPLETED": return { text: "text-green-600", bg: "bg-green-50" };
        case "FAILED": return { text: "text-red-600", bg: "bg-red-50" };
        default: return { text: "text-gray-600", bg: "bg-gray-50" };
      }
    };

    // Overview statistics
    const overviewStats = [
      {
        title: "Total Users",
        value: totalUsers,
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-100",
        href: "/admin/customers",
      },
      {
        title: "Total Investments",
        value: totalInvestments,
        icon: TrendingUp,
        color: "text-green-700",
        bgColor: "bg-green-200",
        href: "/admin/investments",
      },
      {
        title: "Investment Value",
        value: formatCurrency(totalInvestmentValue._sum.amount || 0),
        icon: DollarSign,
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
        href: "/admin/investments",
        isAmount: true,
      },
      {
        title: "Products",
        value: totalProducts,
        icon: Package,
        color: "text-green-800",
        bgColor: "bg-green-50",
        href: "/admin/products",
      },
      {
        title: "States",
        value: totalStates,
        icon: MapPin,
        color: "text-teal-600",
        bgColor: "bg-teal-100",
        href: "/admin/states",
      },
      {
        title: "Locations",
        value: totalLocations,
        icon: Building,
        color: "text-emerald-700",
        bgColor: "bg-emerald-50",
        href: "/admin/locations",
      },
      {
        title: "Land Properties",
        value: totalLands,
        icon: Building,
        color: "text-green-600",
        bgColor: "bg-green-50",
        href: "/admin/lands",
      },
    ];

    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800 dark:text-gray-200">Admin Dashboard</h1>
            <p className="text-green-700 dark:text-gray-400 mt-1">
              Welcome back! Here&apos;s an overview of your platform.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-600 dark:text-gray-400">Last updated</p>
            <p className="text-sm font-medium text-green-800 dark:text-gray-200">
              {formatDate(new Date())}
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <Link href={stat.href}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-green-900 dark:text-gray-200">
                        {stat.isAmount ? stat.value : stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`${stat.bgColor} dark:bg-gray-800 p-3 rounded-lg`}>
                      <stat.icon className={`h-6 w-6 ${stat.color} dark:text-gray-300`} />
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investment Status Breakdown */}
          <Card className="border-green-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-gray-200">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600 dark:text-gray-400" />
                Investment Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {investmentStats.map((stat) => {
                const StatusIcon = getStatusIcon(stat.status);
                const colors = getStatusColor(stat.status);
                
                return (
                  <div key={stat.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`${colors.bg} p-2 rounded-lg`}>
                        <StatusIcon className={`h-5 w-5 ${colors.text}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {stat.status.toLowerCase()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {stat._count._all} investments
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(stat._sum.amount || 0)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Investments */}
          <Card className="border-green-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center text-green-800 dark:text-gray-200">
                <Activity className="h-5 w-5 mr-2 text-green-600 dark:text-gray-400" />
                Recent Investments
              </CardTitle>
              <Link
                href="/admin/investments"
                className="text-sm text-green-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-gray-300 flex items-center"
              >
                View All <Eye className="h-4 w-4 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvestments.length > 0 ? (
                  recentInvestments.slice(0, 5).map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">
                            {investment.user.name}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            investment.status === "ACTIVE" ? "bg-blue-100 text-blue-800" :
                            investment.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                            investment.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {investment.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{investment.product.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(investment.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(investment.amount)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No investments yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <Card className="border-green-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-gray-200">
                <Package className="h-5 w-5 mr-2 text-green-600 dark:text-gray-400" />
                Top Products by Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            {product._count.investments} investments
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No products yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-green-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-gray-200">
                <Plus className="h-5 w-5 mr-2 text-green-600 dark:text-gray-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/admin/products/new"
                  className="flex flex-col items-center p-4 bg-green-100 dark:bg-gray-800 rounded-lg hover:bg-green-200 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  <Package className="h-8 w-8 text-green-700 dark:text-gray-300 mb-2" />
                  <span className="text-sm font-medium text-green-900 dark:text-gray-200">Add Product</span>
                </Link>
                
                <Link
                  href="/admin/states/new"
                  className="flex flex-col items-center p-4 bg-emerald-100 dark:bg-gray-800 rounded-lg hover:bg-emerald-200 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  <MapPin className="h-8 w-8 text-emerald-700 dark:text-gray-300 mb-2" />
                  <span className="text-sm font-medium text-emerald-900 dark:text-gray-200">Add State</span>
                </Link>
                
                <Link
                  href="/admin/lands/new"
                  className="flex flex-col items-center p-4 bg-teal-100 dark:bg-gray-800 rounded-lg hover:bg-teal-200 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  <Building className="h-8 w-8 text-teal-700 dark:text-gray-300 mb-2" />
                  <span className="text-sm font-medium text-teal-900 dark:text-gray-200">Add Land</span>
                </Link>
                
                <Link
                  href="/admin/investments?status=PENDING"
                  className="flex flex-col items-center p-4 bg-green-50 dark:bg-gray-800 rounded-lg hover:bg-green-100 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  <Clock className="h-8 w-8 text-green-600 dark:text-gray-300 mb-2" />
                  <span className="text-sm font-medium text-green-900 dark:text-gray-200">Pending Reviews</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h1>
          <p className="text-gray-600">
            Unable to load dashboard data. Please check your database connection.
          </p>
        </div>
      </div>
    );
  }
}
