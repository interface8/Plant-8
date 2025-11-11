"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Target,
  Activity,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsData {
  overview: {
    totalInvestments: number;
    totalValue: number;
    totalExpectedReturn: number;
    averageInvestment: number;
    averageProgress: number;
    averagePlots: number;
  };
  trends: {
    monthly: Array<{
      month: Date;
      count: number;
      total_amount: number;
      avg_amount: number;
    }>;
    status: Array<{
      status: string;
      _count: { _all: number };
      _sum: { amount: number | null };
      _avg: { progress: number | null };
    }>;
  };
  products: {
    top: Array<{
      id: string;
      name: string;
      _count: { investments: number };
      investments: Array<{ amount: number; status: string }>;
    }>;
    revenue: Array<{
      product_name: string;
      total_revenue: number;
      investment_count: number;
    }>;
    completion: Array<{
      product_type: string;
      total_investments: number;
      completed_investments: number;
      completion_rate: number;
      avg_completion_time: number;
    }>;
  };
  users: {
    distribution: Array<{
      id: string;
      _count: { investments: number };
    }>;
  };
}

interface InvestmentAnalyticsProps {
  data: AnalyticsData;
}

export function InvestmentAnalytics({ data }: InvestmentAnalyticsProps) {
  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING": return Clock;
      case "ACTIVE": return Activity;
      case "COMPLETED": return CheckCircle;
      case "FAILED": return XCircle;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING": return "text-yellow-600 bg-yellow-50";
      case "ACTIVE": return "text-blue-600 bg-blue-50";
      case "COMPLETED": return "text-green-600 bg-green-50";
      case "FAILED": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const overviewMetrics = [
    {
      title: "Total Investments",
      value: data.overview.totalInvestments.toLocaleString(),
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Portfolio Value",
      value: formatCurrency(data.overview.totalValue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Expected Returns",
      value: formatCurrency(data.overview.totalExpectedReturn),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Average Investment",
      value: formatCurrency(data.overview.averageInvestment),
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // Calculate user distribution stats
  const userStats = data.users.distribution.reduce((acc, user) => {
    const investmentCount = user._count.investments;
    if (investmentCount === 1) acc.single++;
    else if (investmentCount <= 3) acc.few++;
    else if (investmentCount <= 5) acc.moderate++;
    else acc.heavy++;
    return acc;
  }, { single: 0, few: 0, moderate: 0, heavy: 0 });

  return (
    <div className="space-y-8">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`${metric.bgColor} p-3 rounded-lg`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Investment Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.trends.status.map((status) => {
                const StatusIcon = getStatusIcon(status.status);
                const statusColor = getStatusColor(status.status);
                const percentage = (status._count._all / data.overview.totalInvestments * 100).toFixed(1);
                
                return (
                  <div key={status.status} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${statusColor}`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {status.status.toLowerCase()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {status._count._all} investments ({percentage}%)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(status._sum.amount || 0)}
                      </p>
                      {status.status === "ACTIVE" && (
                        <p className="text-sm text-gray-600">
                          {(status._avg.progress || 0).toFixed(1)}% avg progress
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Product Revenue Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Revenue Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.products.revenue.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.product_name}</p>
                      <p className="text-sm text-gray-600">
                        {product.investment_count} investments
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(product.total_revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Type Completion Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Product Type Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.products.completion.map((type, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{type.product_type}</p>
                    <p className="text-sm text-gray-600">
                      {type.completion_rate.toFixed(1)}% completion rate
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${type.completion_rate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{type.completed_investments} completed</span>
                    <span>{type.total_investments} total</span>
                  </div>
                  {type.avg_completion_time && (
                    <p className="text-xs text-gray-500">
                      Avg. completion time: {type.avg_completion_time.toFixed(0)} days
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Investment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Investor Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{userStats.single}</p>
                  <p className="text-sm text-gray-600">Single Investment</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{userStats.few}</p>
                  <p className="text-sm text-gray-600">2-3 Investments</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{userStats.moderate}</p>
                  <p className="text-sm text-gray-600">4-5 Investments</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{userStats.heavy}</p>
                  <p className="text-sm text-gray-600">6+ Investments</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Active Investors</span>
                  <span className="font-medium text-gray-900">
                    {data.users.distribution.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Average Investments per User</span>
                  <span className="font-medium text-gray-900">
                    {(data.overview.totalInvestments / data.users.distribution.length).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Trends (Last 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.trends.monthly.map((month, index) => {
              const monthName = new Date(month.month).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              });
              
              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{monthName}</p>
                    <p className="text-sm text-gray-600">{month.count} new investments</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(month.total_amount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(month.avg_amount)} avg
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}