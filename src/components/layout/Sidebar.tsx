"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Upload,
  CreditCard,
  User,
  Activity,
  Briefcase,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GhaziLogo } from "@/components/common/GhaziLogo";

const navItems = [
  { name: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
  { name: "Available Jobs", href: "/candidate/jobs", icon: Briefcase },
  { name: "My Application", href: "/candidate/application", icon: FileText },
  { name: "Upload Documents", href: "/candidate/documents", icon: Upload },
  { name: "Payment", href: "/candidate/payment", icon: CreditCard },
  { name: "Profile", href: "/candidate/profile", icon: User },
  { name: "Application Tracker", href: "/candidate/tracker", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-[#D7E8D8] bg-white min-h-[calc(100vh-80px)] flex flex-col p-4">
      <div className="pb-6 border-b border-[#D7E8D8]">
        <GhaziLogo size="sm" />
      </div>

      <nav className="mt-6 flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all",
                isActive
                  ? "bg-[#167A3D] text-white shadow-md shadow-[#167A3D]/20"
                  : "text-slate-700 hover:bg-[#F8FAF8] hover:text-[#167A3D]"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-[#167A3D]")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-[#D7E8D8]">
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5 text-red-600" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
