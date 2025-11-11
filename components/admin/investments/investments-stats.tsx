"use client";

import { TrendingUp, Users, DollarSign, Activity, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface StatsData {
  count: number;
  totalAmount: number;
  averageProgress: number;
}

interface InvestmentsStatsProps {
  stats: Record<string, StatsData>;
}

export default function InvestmentsStats({ stats }: InvestmentsStatsProps) {
  const totalInvestments = Object.values(stats).reduce((sum, stat) => sum + stat.count, 0);
  const totalAmount = Object.values(stats).reduce((sum, stat) => sum + stat.totalAmount, 0);
  const averageInvestmentAmount = totalInvestments > 0 ? totalAmount / totalInvestments : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return Clock;
      case "ACTIVE": return Activity;
      case "COMPLETED": return CheckCircle;
      case "FAILED": return XCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return { bg: "bg-yellow-50", icon: "text-yellow-600", text: "text-yellow-800" };
      case "ACTIVE": return { bg: "bg-blue-50", icon: "text-blue-600", text: "text-blue-800" };
      case "COMPLETED": return { bg: "bg-green-50", icon: "text-green-600", text: "text-green-800" };
      case "FAILED": return { bg: "bg-red-50", icon: "text-red-600", text: "text-red-800" };
      default: return { bg: "bg-gray-50", icon: "text-gray-600", text: "text-gray-800" };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const overviewStats = [
    {
      name: "Total Investments",
      value: totalInvestments.toString(),
      icon: Users,
      color: { bg: "bg-purple-50", icon: "text-purple-600" },
    },
    {
      name: "Total Value",
      value: formatCurrency(totalAmount),
      icon: DollarSign,
      color: { bg: "bg-green-50", icon: "text-green-600" },
    },
    {
      name: "Average Investment",
      value: formatCurrency(averageInvestmentAmount),
      icon: TrendingUp,
      color: { bg: "bg-blue-50", icon: "text-blue-600" },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {overviewStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color.bg} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color.icon}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([status, data]) => {
            const StatusIcon = getStatusIcon(status);
            const colors = getStatusColor(status);
            
            return (
              <div key={status} className={`${colors.bg} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <StatusIcon className={`h-5 w-5 ${colors.icon}`} />
                  <span className={`text-xs font-medium ${colors.text} uppercase tracking-wide`}>
                    {status}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{data.count}</p>
                  <p className="text-sm text-gray-600">{formatCurrency(data.totalAmount)}</p>
                  {status === "ACTIVE" && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Activity className="h-3 w-3 mr-1" />
                      <span>{data.averageProgress.toFixed(1)}% avg progress</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Health</h3>
          <div className="space-y-3">
            {stats.COMPLETED && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-sm font-medium text-green-600">
                  {((stats.COMPLETED.count / totalInvestments) * 100).toFixed(1)}%
                </span>
              </div>
            )}
            {stats.ACTIVE && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Investments</span>
                <span className="text-sm font-medium text-blue-600">
                  {stats.ACTIVE.count} ({((stats.ACTIVE.count / totalInvestments) * 100).toFixed(1)}%)
                </span>
              </div>
            )}
            {stats.FAILED && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Failed Investments</span>
                <span className="text-sm font-medium text-red-600">
                  {stats.FAILED.count} ({((stats.FAILED.count / totalInvestments) * 100).toFixed(1)}%)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Largest Investment</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(Math.max(...Object.values(stats).map(s => s.totalAmount / s.count || 0)))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Active Value</span>
              <span className="text-sm font-medium text-blue-600">
                {formatCurrency(stats.ACTIVE?.totalAmount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Completed Value</span>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(stats.COMPLETED?.totalAmount || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}