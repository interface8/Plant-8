"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package, TrendingUp, DollarSign, Activity } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductStatsProps {
  products: Product[];
}

export function ProductStats({ products }: ProductStatsProps) {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => 
    (p as any).investments && (p as any).investments.some((inv: any) => inv.status === 'ACTIVE')
  ).length;
  
  const totalInvestments = products.reduce((sum, p) => 
    sum + ((p as any).investments?.length || 0), 0
  );
  
  const avgRoi = products.length > 0
    ? products.reduce((sum, p) => sum + (p.roi || 0), 0) / products.length
    : 0;

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Products",
      value: activeProducts,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Investments",
      value: totalInvestments,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Average ROI",
      value: `${avgRoi.toFixed(1)}%`,
      icon: DollarSign,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
