"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { getCurrentUser } from "@/lib/mock-data";

export function Header() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const user = getCurrentUser();

  function handleLogout() {
    // Clear mock auth cookie
    document.cookie = "mock-auth=; path=/; max-age=0";
    document.cookie = "mock-name=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <>
      <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>

        {/* Spacer for desktop */}
        <div className="hidden md:block" />

        {/* User dropdown */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="hidden sm:inline">{user.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
