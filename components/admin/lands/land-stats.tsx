"use client";

import { MapPin, DollarSign, TrendingUp, Building } from "lucide-react";

interface LandStats {
  total: number;
  totalValue: number;
  averagePrice: number;
  locations: number;
}

interface LandStatsProps {
  lands: Array<{
    id: string;
    dailyPrice: number;
    location: {
      id: string;
      name: string;
    };
  }>;
}

export default function LandStats({ lands }: LandStatsProps) {
  const stats: LandStats = {
    total: lands.length,
    totalValue: lands.reduce((sum, land) => sum + land.dailyPrice, 0),
    averagePrice: lands.length > 0 
      ? lands.reduce((sum, land) => sum + land.dailyPrice, 0) / lands.length
      : 0,
    locations: new Set(lands.map(land => land.location.id)).size,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Lands",
      value: stats.total.toString(),
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Available lands"
    },
    {
      title: "Total Value",
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Combined land value"
    },
    {
      title: "Average Price",
      value: formatCurrency(stats.averagePrice),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Per plot average"
    },
    {
      title: "Locations",
      value: stats.locations.toString(),
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Unique locations"
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