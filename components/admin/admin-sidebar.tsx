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
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
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
    name: "Carousel",
    href: "/admin/carousel",
    icon: ImagePlus,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
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
        "bg-background border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link href="/admin" className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Admin Panel</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
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
                      "w-full justify-start",
                      pathname.startsWith(item.href) && "bg-muted"
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
                            "w-full justify-start text-sm",
                            pathname === child.href && "bg-muted"
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
                    "w-full justify-start",
                    pathname === item.href && "bg-muted"
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

      <div className="border-t p-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/">
            <Store className="h-4 w-4" />
            {!collapsed && <span className="ml-2">View Store</span>}
          </Link>
        </Button>
      </div>
    </div>
  );
}
