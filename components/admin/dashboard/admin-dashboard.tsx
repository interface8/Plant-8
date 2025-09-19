import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Package,
  Users,
  ShoppingCart,
  FolderTree,
  ImagePlus,
} from "lucide-react";

const stats = [
  {
    label: "Products",
    value: 128,
    icon: <Package className="h-6 w-6 text-primary" />,
  },
  {
    label: "Categories",
    value: 12,
    icon: <FolderTree className="h-6 w-6 text-primary" />,
  },
  {
    label: "Orders",
    value: 54,
    icon: <ShoppingCart className="h-6 w-6 text-primary" />,
  },
  {
    label: "Customers",
    value: 37,
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    label: "Carousels",
    value: 5,
    icon: <ImagePlus className="h-6 w-6 text-primary" />,
  },
];

export function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="shadow-sm">
          <CardHeader className="flex items-center gap-3">
            {stat.icon}
            <span className="font-semibold text-lg">{stat.label}</span>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{stat.value}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
