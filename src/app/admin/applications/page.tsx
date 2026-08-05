"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Search, Eye, Filter } from "lucide-react";
import { AdminService } from "@/services/admin.service";
import { CandidateStatus, VerificationStatus } from "@/types";

interface CandidateRow {
  id: string;
  fullName: string;
  cnic: string;
  passportNumber?: string;
  phone: string;
  email?: string;
  profession?: string;
  country?: string;
  status: CandidateStatus;
  paymentStatus: VerificationStatus;
  createdAt: Date | string;
}

export default function AdminApplicationsPage() {
  const [candidatesList, setCandidatesList] = useState<CandidateRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await AdminService.getAllCandidates();
        setCandidatesList(data as CandidateRow[]);
      } catch {
        // Demo fallback candidates
        setCandidatesList([
          {
            id: "cand_1",
            fullName: "Muhammad Ali",
            cnic: "42101-1234567-1",
            passportNumber: "AB9988771",
            phone: "03001234567",
            email: "ali@example.com",
            profession: "Electrician",
            country: "Pakistan",
            status: "registered",
            paymentStatus: "payment_under_review",
            createdAt: new Date().toISOString(),
          },
          {
            id: "cand_2",
            fullName: "Tariq Mahmood",
            cnic: "35202-9876543-2",
            passportNumber: "CD1122334",
            phone: "03019876543",
            email: "tariq@example.com",
            profession: "Welder",
            country: "Saudi Arabia",
            status: "approved",
            paymentStatus: "approved",
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCandidates = candidatesList.filter((c) => {
    // 1. Search Query Match
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      c.fullName.toLowerCase().includes(query) ||
      c.cnic.toLowerCase().includes(query) ||
      (c.passportNumber && c.passportNumber.toLowerCase().includes(query)) ||
      c.phone.toLowerCase().includes(query) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.profession && c.profession.toLowerCase().includes(query)) ||
      (c.country && c.country.toLowerCase().includes(query));

    // 2. Status Filter Match
    if (!matchesSearch) return false;
    if (selectedFilter === "all") return true;
    if (selectedFilter === "pending") return c.status === "registered";
    if (selectedFilter === "awaiting_payment") return c.status === "awaiting_payment_verification";
    if (selectedFilter === "payment_review") return c.paymentStatus === "payment_under_review";
    if (selectedFilter === "approved") return c.status === "approved";
    if (selectedFilter === "rejected") return c.status === "rejected";
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Management Directory"
        subtitle="Search, filter, and process candidate job applications submitted to Ghazi Overseas."
      />

      {/* Search & Filter Control Bar */}
      <Card className="border-[#D7E8D8] bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by Name, CNIC, Passport, Phone, Profession..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#D7E8D8] bg-[#F8FAF8]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <Filter className="h-4 w-4 text-slate-500 mr-1 hidden sm:block" />
            <Button
              size="sm"
              variant={selectedFilter === "all" ? "default" : "outline"}
              onClick={() => setSelectedFilter("all")}
              className={selectedFilter === "all" ? "bg-[#167A3D]" : "border-[#D7E8D8]"}
            >
              All ({candidatesList.length})
            </Button>
            <Button
              size="sm"
              variant={selectedFilter === "pending" ? "default" : "outline"}
              onClick={() => setSelectedFilter("pending")}
              className={selectedFilter === "pending" ? "bg-[#167A3D]" : "border-[#D7E8D8]"}
            >
              Pending
            </Button>
            <Button
              size="sm"
              variant={selectedFilter === "payment_review" ? "default" : "outline"}
              onClick={() => setSelectedFilter("payment_review")}
              className={selectedFilter === "payment_review" ? "bg-[#167A3D]" : "border-[#D7E8D8]"}
            >
              Payment Review
            </Button>
            <Button
              size="sm"
              variant={selectedFilter === "approved" ? "default" : "outline"}
              onClick={() => setSelectedFilter("approved")}
              className={selectedFilter === "approved" ? "bg-[#167A3D]" : "border-[#D7E8D8]"}
            >
              Approved
            </Button>
            <Button
              size="sm"
              variant={selectedFilter === "rejected" ? "default" : "outline"}
              onClick={() => setSelectedFilter("rejected")}
              className={selectedFilter === "rejected" ? "bg-[#167A3D]" : "border-[#D7E8D8]"}
            >
              Rejected
            </Button>
          </div>
        </div>
      </Card>

      {/* Applications Data Table */}
      <Card className="border-[#D7E8D8] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-slate-700 font-bold border-b border-[#D7E8D8]">
              <tr>
                <th className="p-4">Candidate Name</th>
                <th className="p-4">CNIC / Passport</th>
                <th className="p-4">Phone / Email</th>
                <th className="p-4">Profession</th>
                <th className="p-4">App Status</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E8D8] text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                    Loading applications from database...
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                    No matching candidate applications found.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8FAF8] transition-colors">
                    <td className="p-4 font-bold text-slate-900">{c.fullName}</td>
                    <td className="p-4">
                      <div>{c.cnic}</div>
                      <div className="text-[10px] text-slate-400">{c.passportNumber || "No Passport"}</div>
                    </td>
                    <td className="p-4">
                      <div>{c.phone}</div>
                      <div className="text-[10px] text-slate-400">{c.email || "N/A"}</div>
                    </td>
                    <td className="p-4 font-semibold text-[#167A3D]">{c.profession || "General Worker"}</td>
                    <td className="p-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={c.paymentStatus} />
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/applications/${c.id}`}>
                        <Button size="sm" className="bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold gap-1 rounded-xl">
                          <Eye className="h-3.5 w-3.5" /> View Details
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
