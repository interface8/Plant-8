"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Users,
  MapPin,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Building,
  Target,
  BarChart3,
  Calendar,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Store,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

interface DashboardData {
  overview: {
    totalUsers: number;
    totalInvestments: number;
    totalProducts: number;
    totalLands: number;
    totalStates: number;
    totalLocations: number;
  };
  investments: {
    recent: Array<{
      id: string;
      amount: number;
      status: string;
      createdAt: Date;
      user: { name: string; email: string };
      product: { name: string };
    }>;
    stats: Array<{
      status: string;
      _count: { _all: number };
      _sum: { amount: number | null };
      _avg: { progress: number | null };
    }>;
    monthly: Array<{
      month: Date;
      count: number;
      total_amount: number;
    }>;
    totalValue: number;
    averageAmount: number;
    averageProgress: number;
  };
  products: {
    top: Array<{
      id: string;
      name: string;
      imageUrl: string | null;
      _count: { investments: number };
      investments: Array<{ amount: number }>;
    }>;
  };
  users: {
    active: Array<{
      id: string;
      name: string;
      email: string;
      _count: { investments: number };
      investments: Array<{ amount: number; status: string }>;
    }>;
  };
  tasks: {
    recent: Array<{
      id: string;
      name: string;
      status: string;
      createdAt: Date;
      investment: {
        user: { name: string };
        product: { name: string };
      };
    }>;
    stats: Array<{
      status: string;
      _count: { _all: number };
    }>;
  };
}

interface AdminDashboardProps {
  data: DashboardData;
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING": return Clock;
      case "ACTIVE": return Activity;
      case "COMPLETED": return CheckCircle;
      case "FAILED": return XCircle;
      case "IN_PROGRESS": return Activity;
      case "OVERDUE": return AlertCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING": return "text-yellow-600";
      case "ACTIVE": return "text-blue-600";
      case "COMPLETED": return "text-green-600";
      case "FAILED": return "text-red-600";
      case "IN_PROGRESS": return "text-blue-600";
      case "OVERDUE": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  // Calculate growth trends
  const currentMonth = data.investments.monthly[data.investments.monthly.length - 1];
  const previousMonth = data.investments.monthly[data.investments.monthly.length - 2];
  const monthlyGrowth = previousMonth 
    ? ((currentMonth?.count || 0) - previousMonth.count) / previousMonth.count * 100
    : 0;

  const overviewStats = [
    {
      title: "Total Users",
      value: data.overview.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/customers",
    },
    {
      title: "Active Investments",
      value: data.overview.totalInvestments,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/admin/investments",
      trend: monthlyGrowth > 0 ? "up" : "down",
      trendValue: Math.abs(monthlyGrowth).toFixed(1),
    },
    {
      title: "Total Investment Value",
      value: formatCurrency(data.investments.totalValue),
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/admin/investments",
      isAmount: true,
    },
    {
      title: "Products",
      value: data.overview.totalProducts,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/admin/products",
    },
    {
      title: "States & Locations",
      value: `${data.overview.totalStates} / ${data.overview.totalLocations}`,
      icon: MapPin,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      href: "/admin/states",
    },
    {
      title: "Land Properties",
      value: data.overview.totalLands,
      icon: Building,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      href: "/admin/lands",
    },
  ];

  const investmentsByStatus = data.investments.stats.reduce((acc, stat) => {
    acc[stat.status] = {
      count: stat._count._all,
      amount: stat._sum.amount || 0,
      progress: stat._avg.progress || 0,
    };
    return acc;
  }, {} as Record<string, { count: number; amount: number; progress: number }>);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your platform today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-900">{formatDate(new Date())}</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href={stat.href}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.isAmount ? stat.value : stat.value.toLocaleString()}
                      </p>
                      {stat.trend && (
                        <div className={`flex items-center text-sm ${
                          stat.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {stat.trend === "up" ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                          <span>{stat.trendValue}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Investment Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Investment Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(investmentsByStatus).map(([status, data]) => {
              const StatusIcon = getStatusIcon(status);
              const statusColor = getStatusColor(status);
              
              return (
                <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{status.toLowerCase()}</p>
                      <p className="text-sm text-gray-600">{data.count} investments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(data.amount)}</p>
                    {status === "ACTIVE" && (
                      <p className="text-sm text-gray-600">{data.progress.toFixed(1)}% avg progress</p>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Investments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Investments
            </CardTitle>
            <Link
              href="/admin/investments"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
            >
              View All <Eye className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.investments.recent.map((investment) => (
                <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{investment.user.name}</p>
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
                    <p className="text-xs text-gray-500">{formatDate(investment.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(investment.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.products.top.map((product, index) => {
                const totalRevenue = product.investments.reduce((sum, inv) => sum + inv.amount, 0);
                
                return (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product._count.investments} investments</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(totalRevenue)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Tasks
            </CardTitle>
            <Link
              href="/admin/pre-tasks"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
            >
              View All <Eye className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.tasks.recent.slice(0, 5).map((task) => {
                const StatusIcon = getStatusIcon(task.status);
                const statusColor = getStatusColor(task.status);
                
                return (
                  <div key={task.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.name}</p>
                      <p className="text-sm text-gray-600">
                        {task.investment.user.name} - {task.investment.product.name}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(task.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/investments/analytics"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Analytics</span>
            </Link>
            <Link
              href="/admin/investments?status=PENDING"
              className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <Clock className="h-8 w-8 text-yellow-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Pending Reviews</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">User Management</span>
            </Link>
            <Link
              href="/admin/products/new"
              className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Package className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Add Product</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
