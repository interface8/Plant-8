import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  try {
    // Comprehensive analytics data
    const [
      userAnalytics,
      investmentAnalytics,
      totalProducts,
      revenueAnalytics,
      monthlyGrowth,
      topPerformers,
      systemHealth
    ] = await Promise.all([
      // User Analytics
      Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        prisma.user.count({
          where: {
            investments: {
              some: {}
            }
          }
        }),
        prisma.user.groupBy({
          by: ['createdAt'],
          _count: { _all: true },
          where: {
            createdAt: {
              gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ]),

      // Investment Analytics
      Promise.all([
        prisma.investment.count(),
        prisma.investment.aggregate({
          _sum: { amount: true },
          _avg: { amount: true, progress: true }
        }),
        prisma.investment.groupBy({
          by: ['status'],
          _count: { _all: true },
          _sum: { amount: true }
        }),
        prisma.investment.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ]),

      // Product Analytics - just count for now
      prisma.product.count(),

      // Revenue Analytics
      prisma.$queryRaw<Array<{ month: Date; revenue: number; count: number }>>`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          SUM(amount)::float as revenue,
          COUNT(*)::integer as count
        FROM "Investment"
        WHERE "createdAt" >= NOW() - INTERVAL '12 months'
          AND "status" IN ('ACTIVE', 'COMPLETED')
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `,

      // Monthly Growth Rate
      prisma.$queryRaw<Array<{ current_month: number; previous_month: number; growth_rate: number }>>`
        WITH monthly_stats AS (
          SELECT 
            DATE_TRUNC('month', "createdAt") as month,
            COUNT(*)::integer as count,
            SUM(amount)::float as revenue
          FROM "Investment"
          WHERE "createdAt" >= NOW() - INTERVAL '2 months'
          GROUP BY DATE_TRUNC('month', "createdAt")
          ORDER BY month DESC
          LIMIT 2
        )
        SELECT 
          (SELECT count FROM monthly_stats ORDER BY month DESC LIMIT 1) as current_month,
          (SELECT count FROM monthly_stats ORDER BY month ASC LIMIT 1) as previous_month,
          CASE 
            WHEN (SELECT count FROM monthly_stats ORDER BY month ASC LIMIT 1) > 0 
            THEN ((SELECT count FROM monthly_stats ORDER BY month DESC LIMIT 1)::float - (SELECT count FROM monthly_stats ORDER BY month ASC LIMIT 1)::float) / (SELECT count FROM monthly_stats ORDER BY month ASC LIMIT 1)::float * 100
            ELSE 0
          END as growth_rate
      `,

      // Top Performers
      Promise.all([
        prisma.user.findMany({
          take: 5,
          include: {
            _count: { select: { investments: true } },
            investments: {
              select: { amount: true, status: true },
              orderBy: { createdAt: 'desc' }
            }
          },
          orderBy: {
            investments: { _count: 'desc' }
          }
        }),
        prisma.product.findMany({
          take: 5,
          include: {
            _count: { select: { investments: true } },
            investments: {
              select: { amount: true, status: true }
            }
          },
          orderBy: {
            investments: { _count: 'desc' }
          }
        })
      ]),

      // System Health
      Promise.all([
        prisma.investment.count({ where: { status: 'PENDING' } }),
        prisma.investment.count({ where: { status: 'FAILED' } }),
        prisma.task.count({ where: { status: 'PENDING' } }),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ])
    ]);

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const formatPercentage = (value: number) => {
      return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    // Calculate key metrics
    const [, , activeInvestors] = userAnalytics;
    const [totalInvestments, investmentStats, investmentsByStatus, newInvestmentsThisMonth] = investmentAnalytics;
    const [topUsers, topProducts] = topPerformers;
    const [pendingInvestments, failedInvestments, pendingTasks, newUsersThisWeek] = systemHealth;

    const totalRevenue = investmentStats._sum.amount || 0;
    const averageInvestment = investmentStats._avg.amount || 0;
    const averageProgress = investmentStats._avg.progress || 0;
    const growthRate = monthlyGrowth[0]?.growth_rate || 0;

    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive insights and performance metrics
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                  <p className="text-blue-100 text-xs mt-1">
                    Average: {formatCurrency(averageInvestment)}
                  </p>
                </div>
                <div className="bg-blue-400 bg-opacity-50 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Monthly Growth</p>
                  <p className="text-2xl font-bold">{formatPercentage(growthRate)}</p>
                  <p className="text-green-100 text-xs mt-1">
                    {newInvestmentsThisMonth} new this month
                  </p>
                </div>
                <div className="bg-green-400 bg-opacity-50 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Active Users</p>
                  <p className="text-2xl font-bold">{activeInvestors}</p>
                  <p className="text-purple-100 text-xs mt-1">
                    {newUsersThisWeek} joined this week
                  </p>
                </div>
                <div className="bg-purple-400 bg-opacity-50 p-3 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Avg Progress</p>
                  <p className="text-2xl font-bold">{averageProgress.toFixed(1)}%</p>
                  <p className="text-orange-100 text-xs mt-1">
                    {pendingTasks} pending tasks
                  </p>
                </div>
                <div className="bg-orange-400 bg-opacity-50 p-3 rounded-lg">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investment Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Investment Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investmentsByStatus.map((status) => {
                  const percentage = ((status._count._all / totalInvestments) * 100).toFixed(1);
                  const colors = {
                    PENDING: { bg: 'bg-yellow-100', bar: 'bg-yellow-500', text: 'text-yellow-700' },
                    ACTIVE: { bg: 'bg-blue-100', bar: 'bg-blue-500', text: 'text-blue-700' },
                    COMPLETED: { bg: 'bg-green-100', bar: 'bg-green-500', text: 'text-green-700' },
                    FAILED: { bg: 'bg-red-100', bar: 'bg-red-500', text: 'text-red-700' },
                  }[status.status] || { bg: 'bg-gray-100', bar: 'bg-gray-500', text: 'text-gray-700' };

                  return (
                    <div key={status.status} className={`p-4 rounded-lg ${colors.bg}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${colors.text}`}>
                          {status.status}
                        </span>
                        <div className="text-right">
                          <span className={`text-sm font-medium ${colors.text}`}>
                            {status._count._all} ({percentage}%)
                          </span>
                          <p className="text-xs text-gray-600">
                            {formatCurrency(status._sum.amount || 0)}
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors.bar}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Monthly Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueAnalytics.slice(-6).map((month, index) => {
                  const maxRevenue = Math.max(...revenueAnalytics.map(m => m.revenue));
                  const percentage = (month.revenue / maxRevenue) * 100;
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {new Date(month.month).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-20 text-right">
                          {formatCurrency(month.revenue)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Investors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Top Investors
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/customers">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topUsers.map((user, index) => {
                  const totalInvestment = user.investments.reduce((sum, inv) => sum + inv.amount, 0);
                  const activeInvestments = user.investments.filter(inv => inv.status === 'ACTIVE').length;
                  
                  return (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(totalInvestment)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {user._count.investments} total ({activeInvestments} active)
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Top Products
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/products">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => {
                  const totalRevenue = product.investments.reduce((sum, inv) => sum + inv.amount, 0);
                  const activeInvestments = product.investments.filter(inv => inv.status === 'ACTIVE').length;
                  
                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full text-sm font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            {product._count.investments} investments
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(totalRevenue)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activeInvestments} active
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              System Health & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Pending Investments</p>
                    <p className="text-2xl font-bold text-yellow-900">{pendingInvestments}</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Needs Review
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Failed Investments</p>
                    <p className="text-2xl font-bold text-red-900">{failedInvestments}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    Action Required
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">New Users (7d)</p>
                    <p className="text-2xl font-bold text-blue-900">{newUsersThisWeek}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    Growth
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Pending Tasks</p>
                    <p className="text-2xl font-bold text-orange-900">{pendingTasks}</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    In Queue
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Analytics page error:", error);
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Analytics Error</h1>
          <p className="text-gray-600">
            Unable to load analytics data. Please check your database connection.
          </p>
        </div>
      </div>
    );
  }
}