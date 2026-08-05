import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAF8]">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
