"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  FileText,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/blog-manager",
    icon: LayoutDashboard,
  },
  {
    name: "Blogs",
    href: "/blog-manager/blogs",
    icon: FileText,
    children: [
      { name: "All Blogs", href: "/blog-manager/blogs" },
      { name: "My Drafts", href: "/blog-manager/blogs?status=DRAFT" },
      { name: "Pending Approval", href: "/blog-manager/blogs?approval=PENDING" },
      { name: "Approved", href: "/blog-manager/blogs?approval=APPROVED" },
      { name: "Rejected", href: "/blog-manager/blogs?approval=REJECTED" },
    ],
  },
  {
    name: "Profile",
    href: "/blog-manager/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/blog-manager/settings",
    icon: Settings,
  },
];

export function BlogManagerSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>(["Blogs"]);

  const toggleSection = (name: string) => {
    setOpenSections((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-gradient-to-b from-green-600 to-green-700 text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-green-500">
        {!collapsed && (
          <Link href="/blog-manager" className="text-xl font-bold">
            Blog Manager
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-green-800 text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const isOpen = openSections.includes(item.name);

            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  onClick={(e) => {
                    if (item.children) {
                      e.preventDefault();
                      toggleSection(item.name);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-green-800 text-white"
                      : "text-white hover:bg-green-800",
                    collapsed && "justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>

                {!collapsed && item.children && isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href || 
                        (child.href.includes('?') && pathname === child.href.split('?')[0]);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm transition-colors",
                            isChildActive
                              ? "bg-green-800 text-white font-medium"
                              : "text-green-100 hover:bg-green-800 hover:text-white"
                          )}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-green-500 p-4">
        {!collapsed && (
          <div className="text-xs text-green-200">
            <p className="font-medium">Blog Manager Portal</p>
            <p className="mt-1">Manage your blog content</p>
          </div>
        )}
      </div>
    </div>
  );
}
