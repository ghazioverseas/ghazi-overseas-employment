"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, ShieldCheck, UserCheck, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GhaziLogo } from "@/components/common/GhaziLogo";
import { getAuthSessionAction, logoutAction } from "@/actions/auth.actions";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await getAuthSessionAction();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    setUser(null);
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
    <header className="sticky top-0 z-40 w-full border-b border-[#D7E8D8] bg-[#F8FAF8]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Licensing */}
        <div className="flex items-center gap-4">
          <GhaziLogo size="md" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-[#167A3D] border border-emerald-200 shadow-sm">
                <UserCheck className="h-4 w-4 text-[#167A3D]" />
                <span className="max-w-[160px] truncate">{user.name || user.email}</span>
              </div>

              <Link href={user.role === "admin" ? "/admin/dashboard" : "/candidate/dashboard"}>
                <Button size="sm" className="gap-1.5 bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold rounded-xl text-xs">
                  <LayoutDashboard className="h-3.5 w-3.5" /> Portal Dashboard
                </Button>
              </Link>

              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
                className="gap-1 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-bold rounded-xl"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 transition-colors hover:text-[#167A3D]"
              >
                Candidate Login
              </Link>

              <Link href="/register">
                <Button size="lg" className="gap-2 bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold rounded-xl shadow-md">
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#D7E8D8] bg-white text-slate-800 hover:bg-slate-50 md:hidden"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#D7E8D8] bg-white p-4 shadow-lg md:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs font-bold text-[#167A3D]">
                  <UserCheck className="h-4 w-4" />
                  <span>Logged in as: {user.email}</span>
                </div>
                <Link
                  href={user.role === "admin" ? "/admin/dashboard" : "/candidate/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full justify-center bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold py-2.5 text-xs">
                    Candidate Portal Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 text-xs py-2 font-bold"
                >
                  Logout Account
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-11 items-center rounded-lg px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Candidate Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button className="w-full justify-center bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold py-3">
                    Apply Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
