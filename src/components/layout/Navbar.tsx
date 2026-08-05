"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GhaziLogo } from "@/components/common/GhaziLogo";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D7E8D8] bg-[#F8FAF8]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Licensing */}
        <div className="flex items-center gap-4">
          <GhaziLogo size="md" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#167A3D] bg-[#167A3D]/10 px-3 py-1.5 rounded-full border border-[#D7E8D8]">
            <ShieldCheck className="h-4 w-4 text-[#167A3D]" />
            <span>Government Verification Portal</span>
          </div>

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
          </div>
        </div>
      )}
    </header>
  );
}
