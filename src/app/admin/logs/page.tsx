"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getAllSystemLogsAction } from "@/actions/admin.actions";

interface LogRow {
  id: string;
  action?: string;
  level?: string;
  category?: string;
  message?: string;
  userId?: string | null;
  userRole?: string;
  metadata?: Record<string, unknown>;
  details?: string;
  createdAt: Date | string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await getAllSystemLogsAction();
        if (res.success && res.data) {
          setLogs(res.data as LogRow[]);
        } else {
          setLogs([]);
        }
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      !search ||
      (l.action && l.action.toLowerCase().includes(search.toLowerCase())) ||
      (l.message && l.message.toLowerCase().includes(search.toLowerCase())) ||
      (l.userId && l.userId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Audit Log Explorer"
        subtitle="Searchable security audit log tracking all administrative decisions, payment approvals, settings edits, and file purges."
      />

      <Card className="border-[#D7E8D8] bg-white p-4 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search system logs by action, user ID, or payload..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-[#D7E8D8] bg-[#F8FAF8]"
          />
        </div>
      </Card>

      <Card className="border-[#D7E8D8] bg-[#ffffff] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-slate-700 font-bold border-b border-[#D7E8D8]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action Event / Message</th>
                <th className="p-4">User ID & Role</th>
                <th className="p-4">Event Payload Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E8D8] text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-semibold">
                    Loading system audit log trail...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-semibold">
                    No matching system logs recorded.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-[#F8FAF8] transition-colors">
                    <td className="p-4 font-semibold text-slate-500">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="rounded bg-emerald-100 px-2 py-1 font-extrabold text-[#167A3D] text-[10px]">
                        {l.message || l.action || "SYSTEM_EVENT"}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {l.userId || "System"} ({l.userRole || "admin"})
                    </td>
                    <td className="p-4 font-mono text-[10px] text-slate-600 truncate max-w-xs">
                      {l.details || JSON.stringify(l.metadata || {})}
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
