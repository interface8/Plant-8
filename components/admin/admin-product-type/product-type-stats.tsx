"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FolderTree, Layers, Package, TrendingUp } from "lucide-react";
import { ProductType } from "@/types/product";

interface ProductTypeStatsProps {
  productTypes: ProductType[];
}

export function ProductTypeStats({ productTypes }: ProductTypeStatsProps) {
  const totalTypes = productTypes.length;
  const parentTypes = productTypes.filter(pt => !pt.prevId).length;
  const subTypes = productTypes.filter(pt => pt.prevId).length;
  const avgSubTypes = parentTypes > 0 
    ? (subTypes / parentTypes).toFixed(1)
    : 0;

  const stats = [
    {
      title: "Total Types",
      value: totalTypes,
      icon: FolderTree,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Parent Categories",
      value: parentTypes,
      icon: Layers,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Sub Categories",
      value: subTypes,
      icon: Package,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Avg Sub/Parent",
      value: avgSubTypes,
      icon: TrendingUp,
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
