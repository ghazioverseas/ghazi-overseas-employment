import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAF8]">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}
