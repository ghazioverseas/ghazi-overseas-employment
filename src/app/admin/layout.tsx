"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminLogin = pathname === "/admin/login";

  if (isAdminLogin) {
    return <div className="min-h-screen bg-[#F8FAF8]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAF8]">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
