"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Folder,
  CreditCard,
  Settings,
  ShieldCheck,
  BarChart3,
  ListOrdered,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GhaziLogo } from "@/components/common/GhaziLogo";

const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Applications", href: "/admin/applications", icon: FileText },
  { name: "Candidates", href: "/admin/candidates", icon: Users },
  { name: "Documents", href: "/admin/documents", icon: Folder },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "System Logs", href: "/admin/logs", icon: ListOrdered },
  { name: "Admins", href: "/admin/admins", icon: ShieldCheck },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-[#D7E8D8] bg-white min-h-[calc(100vh-80px)] flex flex-col p-4">
      <div className="pb-6 border-b border-[#D7E8D8] flex flex-col gap-2">
        <GhaziLogo size="sm" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#167A3D] bg-emerald-50 px-2 py-1 rounded border border-[#D7E8D8] text-center mt-1">
          Admin Portal Engine
        </span>
      </div>

      <nav className="mt-6 flex-1 space-y-1.5">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
          <span>Admin Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
