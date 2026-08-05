"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, Menu, X, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & License */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-white shadow-md shadow-blue-900/20">
            <Building2 className="h-6 w-6 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Ghazi Overseas Employment
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-blue-700">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> License # OPEP-1234
            </span>
          </div>
        </Link>

        {/* Desktop Links & Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Candidate Sign In
          </Link>
          <Link href="/register">
            <Button size="lg" className="gap-2 bg-blue-700 hover:bg-blue-800">
              Apply Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 md:hidden"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white p-4 shadow-lg md:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Candidate Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button className="w-full justify-center bg-blue-700 py-3 text-sm hover:bg-blue-800">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
