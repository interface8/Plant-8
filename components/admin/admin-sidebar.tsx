"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
  Store,
  ImagePlus,
  MapPin,
  TrendingUp,
  Shield,
  MessageSquareQuote 
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    children: [
      { name: "Overview", href: "/admin" },
      { name: "Analytics", href: "/admin/analytics" },
    ],
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    children: [
      { name: "All Products", href: "/admin/products" },
      { name: "Add Product", href: "/admin/products/new" },
    ],
  },
  {
    name: "Product Types",
    href: "/admin/product-types",
    icon: FolderTree,
    children: [
      { name: "All Product Types", href: "/admin/product-types" },
      { name: "Add Product Type", href: "/admin/product-types/new" },
    ],
  },
  {
    name: "Pre Tasks",
    href: "/admin/pre-tasks",
    icon: ShoppingCart,
    children: [
      { name: "All Pre Tasks", href: "/admin/pre-tasks" },
      { name: "Pending Pre Tasks", href: "/admin/pre-tasks?status=pending" },
      { name: "Completed Pre Tasks", href: "/admin/pre-tasks?status=completed" },
    ],
  },
  {
    name: "Lands",
    href: "/admin/lands",
    icon: MapPin,
    children: [
      { name: "All Lands", href: "/admin/lands" },
      { name: "Add Land", href: "/admin/lands/new" },
    ],
  },
  {
    name: "States & Locations",
    href: "/admin/locations",
    icon: Store,
    children: [
      { name: "All States", href: "/admin/states" },
      { name: "Add State", href: "/admin/states/new" },
      { name: "All Locations", href: "/admin/locations" },
      { name: "Add Location", href: "/admin/locations/new" },
    ],
  },
  {
    name: "Investments",
    href: "/admin/investments",
    icon: TrendingUp,
    children: [
      { name: "All Investments", href: "/admin/investments" },
      { name: "Active Investments", href: "/admin/investments?status=ACTIVE" },
      { name: "Pending Investments", href: "/admin/investments?status=PENDING" },
      { name: "Completed Investments", href: "/admin/investments?status=COMPLETED" },
      { name: "Investment Analytics", href: "/admin/investments/analytics" },
    ],
    
  },
  {
    name: "Carousel",
    href: "/admin/carousel",
    icon: ImagePlus,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
   {
    name: "Testimony",
    href: "/admin/testimonyManager",
    icon: MessageSquareQuote ,
  },
  {
    name: "Role Management",
    href: "/admin/roles",
    icon: Shield,
    children: [
      { name: "All Roles", href: "/admin/roles" },
      { name: "Audit Log", href: "/admin/roles/audit" },
    ],
  },

];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-b from-green-600 to-green-700 border-r border-green-800 transition-all duration-300 shadow-lg",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-green-800 bg-green-700/50">
        {!collapsed && (
          <Link href="/admin" className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-white" />
            <span className="font-bold text-lg text-white">Admin Panel</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 hover:bg-green-800 text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-white" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-white hover:bg-green-800 hover:text-white",
                      pathname.startsWith(item.href) && "bg-green-800 text-white font-semibold"
                    )}
                    onClick={() => !collapsed && toggleExpanded(item.name)}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && (
                      <>
                        <span className="ml-2">{item.name}</span>
                        <ChevronRight
                          className={cn(
                            "ml-auto h-4 w-4 transition-transform",
                            expandedItems.includes(item.name) && "rotate-90"
                          )}
                        />
                      </>
                    )}
                  </Button>
                  {!collapsed && expandedItems.includes(item.name) && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <Button
                          key={child.href}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start text-sm text-green-100 hover:bg-green-800 hover:text-white",
                            pathname === child.href && "bg-green-800 text-white font-semibold"
                          )}
                          asChild
                        >
                          <Link href={child.href}>{child.name}</Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-green-800 hover:text-white",
                    pathname === item.href && "bg-green-800 text-white font-semibold"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-2">{item.name}</span>}
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-green-800 p-4 bg-green-700/50">
        <Button variant="outline" className="w-full border-white/30 text-white hover:bg-green-800 hover:text-white hover:border-white" asChild>
          <Link href="/">
            <Store className="h-4 w-4" />
            {!collapsed && <span className="ml-2">View Store</span>}
          </Link>
        </Button>
      </div>
    </div>
  );
}
