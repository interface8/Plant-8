"use client";

import { CheckCircle, Clock, Package, TrendingUp } from "lucide-react";

interface PreTaskStats {
  total: number;
  withDueDate: number;
  recentlyCreated: number;
  products: number;
}

interface PreTaskStatsProps {
  preTasks: Array<{
    id: string;
    estimatedCompletionDate: Date | null;
    createdAt: Date;
    product: {
      id: string;
      name: string;
    } | null;
  }>;
  products: Array<{ id: string; name: string }>;
}

export default function PreTaskStats({ preTasks, products }: PreTaskStatsProps) {
  const stats: PreTaskStats = {
    total: preTasks.length,
    withDueDate: preTasks.filter(task => task.estimatedCompletionDate).length,
    recentlyCreated: preTasks.filter(task => {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return new Date(task.createdAt) > oneDayAgo;
    }).length,
    products: products.length,
  };

  const statCards = [
    {
      title: "Total Pre-Tasks",
      value: stats.total,
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Active pre-tasks"
    },
    {
      title: "With Due Dates",
      value: stats.withDueDate,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Have deadlines set"
    },
    {
      title: "Recently Created",
      value: stats.recentlyCreated,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Created in last 24h"
    },
    {
      title: "Products",
      value: stats.products,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Available products"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className={`${stat.bgColor} p-3 rounded-lg`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}