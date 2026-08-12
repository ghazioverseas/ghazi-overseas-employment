"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { CandidateAuthGuard } from "@/components/auth/CandidateAuthGuard";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CandidateAuthGuard>
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAF8]">
        <Sidebar />
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">{children}</main>
      </div>
    </CandidateAuthGuard>
  );
}
