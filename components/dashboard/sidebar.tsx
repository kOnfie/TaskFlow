"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Home, User, Briefcase, Code, Heart, ChevronLeft, ChevronRight, LogOut } from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "All Tasks", href: "/dashboard/tasks", icon: Briefcase },
];

const categories = [
  { name: "Work", href: "/dashboard/work", icon: Briefcase, color: "bg-blue-500" },
  { name: "Personal", href: "/dashboard/personal", icon: User, color: "bg-green-500" },
  { name: "Development", href: "/dashboard/development", icon: Code, color: "bg-yellow-500" },
  { name: "Health", href: "/dashboard/health", icon: Heart, color: "bg-red-500" },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const router = useRouter();

  function signOut() {
    localStorage.removeItem("user");
    router.push("/");
  }

  return (
    <div
      className={cn(
        "sticky flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100",
                  pathname === item.href ? "bg-blue-50 text-blue-700" : "text-gray-700"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <Separator className="my-4" />

        <div className="space-y-2">
          {!collapsed && (
            <div className="flex items-center justify-between px-3 py-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Categories</h3>
            </div>
          )}

          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100",
                  pathname === category.href ? "bg-blue-50 text-blue-700" : "text-gray-700"
                )}
              >
                <div className={cn("h-5 w-5 rounded-full flex items-center justify-center", category.color)}>
                  <Icon className="h-3 w-3 text-white" />
                </div>
                {!collapsed && <span>{category.name}</span>}
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-gray-200">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
