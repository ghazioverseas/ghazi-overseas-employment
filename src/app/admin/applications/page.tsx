"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Search, Eye, Filter } from "lucide-react";
import { getAllApplicationsAction } from "@/actions/admin.actions";
import { CandidateStatus, VerificationStatus } from "@/types";

interface ApplicationRow {
  id: string;
  fullName: string;
  cnic: string;
  passportNumber?: string;
  phone: string;
  profession?: string;
  country?: string;
  status: CandidateStatus;
  paymentStatus: VerificationStatus;
  createdAt: Date | string;
}

export default function AdminApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [applications, setApplications] = useState<ApplicationRow[]>([]);

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await getAllApplicationsAction();
        if (res.success && res.data) {
          setApplications(res.data as ApplicationRow[]);
        } else {
          setApplications([]);
        }
      } catch {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  const filtered = applications.filter((app) => {
    const matchesSearch =
      !search ||
      app.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      app.cnic?.toLowerCase().includes(search.toLowerCase()) ||
      app.passportNumber?.toLowerCase().includes(search.toLowerCase()) ||
      app.phone?.toLowerCase().includes(search.toLowerCase()) ||
      app.profession?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filterStatus === "all" || app.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Management Directory"
        subtitle="Search, filter, and process candidate applications with real-time Neon DB status updates."
      />

      {/* Filter and Search Bar */}
      <Card className="border-[#D7E8D8] bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by Name, CNIC, Passport, Phone, Trade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-[#D7E8D8] bg-[#F8FAF8]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="h-4 w-4 text-[#167A3D] shrink-0" />
            <span className="text-xs font-bold text-slate-600">Filter:</span>
            {["all", "registered", "under_review", "awaiting_payment_verification", "approved", "rejected"].map((st) => (
              <Button
                key={st}
                size="sm"
                variant={filterStatus === st ? "default" : "outline"}
                onClick={() => setFilterStatus(st)}
                className={`h-8 text-xs font-bold capitalize rounded-xl ${
                  filterStatus === st
                    ? "bg-[#167A3D] text-white hover:bg-[#0E5D2E]"
                    : "border-[#D7E8D8] text-slate-700 bg-white"
                }`}
              >
                {st.replace(/_/g, " ")}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Applications Directory Table */}
      <Card className="border-[#D7E8D8] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-slate-700 font-bold border-b border-[#D7E8D8]">
              <tr>
                <th className="p-4">Candidate Name</th>
                <th className="p-4">CNIC</th>
                <th className="p-4">Passport</th>
                <th className="p-4">Trade Profession</th>
                <th className="p-4">App Status</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E8D8] text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                    Loading application directory from Neon DB...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                    No candidate applications match search query.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-[#F8FAF8] transition-colors">
                    <td className="p-4 font-bold text-slate-900">{app.fullName}</td>
                    <td className="p-4 font-mono">{app.cnic}</td>
                    <td className="p-4 font-mono">{app.passportNumber || "N/A"}</td>
                    <td className="p-4 font-bold text-[#167A3D]">{app.profession || "General Worker"}</td>
                    <td className="p-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={app.paymentStatus} />
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/applications/${app.id}`}>
                        <Button size="sm" className="bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold gap-1 rounded-xl">
                          <Eye className="h-3.5 w-3.5" /> View File
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
