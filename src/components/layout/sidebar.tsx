"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Briefcase,
  Truck,
  DollarSign,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAccount } from "@/lib/mock-data";

const navItems = [
  { label: "Dashboard", icon: Home, path: "/" },
  { label: "Leads", icon: Users, path: "/leads" },
  { label: "Jobs", icon: Briefcase, path: "/jobs" },
  { label: "Subs", icon: Truck, path: "/subs" },
  { label: "Payouts", icon: DollarSign, path: "/payouts" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const account = getAccount();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-background">
      {/* Logo / Company Name */}
      <div className="flex items-center h-16 px-6 border-b">
        <h1 className="text-xl font-bold">{account.company_name}</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/" && pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
