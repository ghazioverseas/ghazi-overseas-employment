"use client";

import React, { useState } from "react";
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
  Briefcase,
  GitMerge,
  Globe,
  Mail,
  Megaphone,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GhaziLogo } from "@/components/common/GhaziLogo";
import { logoutAction } from "@/actions/auth.actions";

const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Jobs Console", href: "/admin/jobs", icon: Briefcase },
  { name: "Recruitment Pipeline", href: "/admin/pipeline", icon: GitMerge },
  { name: "Applications", href: "/admin/applications", icon: FileText },
  { name: "Candidates", href: "/admin/candidates", icon: Users },
  { name: "Documents", href: "/admin/documents", icon: Folder },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Website CMS", href: "/admin/cms", icon: Globe },
  { name: "Contact Inquiries", href: "/admin/contacts", icon: Mail },
  { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "System Logs", href: "/admin/logs", icon: ListOrdered },
  { name: "Admins", href: "/admin/admins", icon: ShieldCheck },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    if (typeof document !== "undefined") {
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
      });
    }
    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* Mobile Top Header for Admin */}
      <div className="lg:hidden sticky top-[80px] z-30 flex items-center justify-between border-b border-[#D7E8D8] bg-white p-3.5 shadow-sm">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center gap-2.5 rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] px-3 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-100"
          aria-label="Open Admin Menu Drawer"
        >
          <Menu className="h-4 w-4 text-[#167A3D]" />
          <span>Admin Menu</span>
        </button>

        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#167A3D] bg-emerald-50 px-2.5 py-1 rounded border border-[#D7E8D8]">
          Admin Console
        </span>
      </div>

      {/* Mobile Drawer for Admin */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D7E8D8]">
                <GhaziLogo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-5 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all",
                        isActive
                          ? "bg-[#167A3D] text-white shadow-md shadow-[#167A3D]/20"
                          : "text-slate-700 hover:bg-[#F8FAF8] hover:text-[#167A3D]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-[#167A3D]")} />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className={cn("h-3.5 w-3.5 opacity-50", isActive && "opacity-100")} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#D7E8D8]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4 text-red-600" />
                <span>Admin Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Admin Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-[#D7E8D8] bg-white min-h-[calc(100vh-80px)] flex-col p-4">
        <div className="pb-6 border-b border-[#D7E8D8] flex flex-col gap-2">
          <GhaziLogo size="sm" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#167A3D] bg-emerald-50 px-2 py-1 rounded border border-[#D7E8D8] text-center mt-1">
            Admin Portal Engine
          </span>
        </div>

        <nav className="mt-6 flex-1 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all",
                  isActive
                    ? "bg-[#167A3D] text-white shadow-md shadow-[#167A3D]/20"
                    : "text-slate-700 hover:bg-[#F8FAF8] hover:text-[#167A3D]"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-[#167A3D]")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-[#D7E8D8]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 text-red-600" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
