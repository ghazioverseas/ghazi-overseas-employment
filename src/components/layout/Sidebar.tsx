"use client";

import React, { useEffect, useState } from "react";
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
  UserCheck,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GhaziLogo } from "@/components/common/GhaziLogo";
import { getCurrentCandidateProfileAction } from "@/actions/candidate.actions";
import { logoutAction } from "@/actions/auth.actions";

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
  const [profile, setProfile] = useState<{ fullName?: string; email?: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getCurrentCandidateProfileAction();
        if (res.success && res.data) {
          setProfile({
            fullName: res.data.fullName,
            email: res.data.email,
          });
        }
      } catch {
        setProfile(null);
      }
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    setProfile(null);
    await logoutAction();
    if (typeof document !== "undefined") {
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
      });
    }
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <div className="lg:hidden sticky top-[80px] z-30 flex items-center justify-between border-b border-[#D7E8D8] bg-white p-3.5 shadow-sm">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center gap-2.5 rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] px-3 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-100"
          aria-label="Open Navigation Drawer"
        >
          <Menu className="h-4 w-4 text-[#167A3D]" />
          <span>Candidate Menu</span>
        </button>

        {profile && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#167A3D] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <UserCheck className="h-3.5 w-3.5" />
            <span className="max-w-[120px] truncate">{profile.fullName || "Candidate"}</span>
          </div>
        )}
      </div>

      {/* Mobile Drawer Overlay & Sidebar */}
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

              <nav className="mt-5 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-bold transition-all",
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

            <div className="pt-4 border-t border-[#D7E8D8] space-y-3">
              {profile && (
                <div className="rounded-xl bg-emerald-50/80 p-3 border border-emerald-200 text-xs">
                  <p className="font-extrabold text-slate-900 truncate">{profile.fullName || "Candidate User"}</p>
                  <p className="text-[10px] text-slate-600 truncate">{profile.email}</p>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4 text-red-600" />
                <span>Logout Candidate Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-[#D7E8D8] bg-white min-h-[calc(100vh-80px)] flex-col p-4">
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

        {profile && (
          <div className="mb-4 rounded-xl bg-emerald-50/80 p-3 border border-emerald-200">
            <div className="flex items-center gap-2 text-xs font-bold text-[#167A3D]">
              <UserCheck className="h-4 w-4 shrink-0" />
              <div className="truncate">
                <p className="truncate text-slate-900">{profile.fullName || "Candidate User"}</p>
                <p className="truncate text-[11px] font-normal text-slate-600">{profile.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#D7E8D8]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5 text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
