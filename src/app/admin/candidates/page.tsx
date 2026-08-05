"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Search, Eye } from "lucide-react";
import { AdminService } from "@/services/admin.service";
import { CandidateStatus } from "@/types";

interface CandidateRow {
  id: string;
  fullName: string;
  cnic: string;
  phone: string;
  city?: string;
  province?: string;
  profession?: string;
  status: CandidateStatus;
}

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidates() {
      try {
        const data = await AdminService.getAllCandidates();
        setCandidates(data as CandidateRow[]);
      } catch {
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, []);

  const filtered = candidates.filter(
    (c) =>
      !search ||
      c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.cnic?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.toLowerCase().includes(search.toLowerCase()) ||
      c.profession?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Master Directory"
        subtitle="Complete database registry of all registered applicants and overseas deployment candidates."
      />

      <Card className="border-[#D7E8D8] bg-white p-4 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search candidates by name, CNIC, phone, trade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-[#D7E8D8] bg-[#F8FAF8]"
          />
        </div>
      </Card>

      <Card className="border-[#D7E8D8] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-slate-700 font-bold border-b border-[#D7E8D8]">
              <tr>
                <th className="p-4">Candidate Name</th>
                <th className="p-4">CNIC Number</th>
                <th className="p-4">Phone</th>
                <th className="p-4">City / Province</th>
                <th className="p-4">Profession</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E8D8] text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                    Loading candidates database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                    No candidates registered in database.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8FAF8] transition-colors">
                    <td className="p-4 font-bold text-slate-900">{c.fullName}</td>
                    <td className="p-4">{c.cnic}</td>
                    <td className="p-4">{c.phone}</td>
                    <td className="p-4">{c.city || "Karachi"}, {c.province || "Sindh"}</td>
                    <td className="p-4 font-bold text-[#167A3D]">{c.profession || "General Worker"}</td>
                    <td className="p-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/applications/${c.id}`}>
                        <Button size="sm" className="bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold gap-1 rounded-xl">
                          <Eye className="h-3.5 w-3.5" /> View
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
