"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Home, Users, Briefcase, Truck, DollarSign, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getAccount } from "@/lib/mock-data";

const navItems = [
  { label: "Dashboard", icon: Home, path: "/" },
  { label: "Leads", icon: Users, path: "/leads" },
  { label: "Jobs", icon: Briefcase, path: "/jobs" },
  { label: "Subs", icon: Truck, path: "/subs" },
  { label: "Payouts", icon: DollarSign, path: "/payouts" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const account = getAccount();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-background shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold">{account.company_name}</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path !== "/" && pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
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
      </div>
    </div>
  );
}
