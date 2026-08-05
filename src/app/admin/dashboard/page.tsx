"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { NotificationCenter } from "@/components/common/NotificationCenter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  UserCheck,
  FileText,
  HardDrive,
  Trash2,
  Search,
  Briefcase,
  GitMerge,
  Globe,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getDashboardMetricsAction, runAutoDeleteAction } from "@/actions/admin.actions";
import { performGlobalSearchAction } from "@/actions/cms.actions";

interface DashboardMetrics {
  totalCandidates: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingPayments: number;
  todayRegistrations: number;
  documentsUploaded: number;
  storageUsedBytes: number;
}

interface SearchCandidate {
  id: string;
  fullName: string;
  cnic: string;
  status: string;
}

interface SearchJob {
  id: string;
  title: string;
  country: string;
  status: string;
}

interface SearchLog {
  id: string;
  message: string;
  category: string;
}

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [purging, setPurging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    candidates: SearchCandidate[];
    jobs: SearchJob[];
    logs: SearchLog[];
  } | null>(null);

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalCandidates: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    pendingPayments: 0,
    todayRegistrations: 0,
    documentsUploaded: 0,
    storageUsedBytes: 0,
  });

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await getDashboardMetricsAction();
        if (res.success && res.data) {
          setMetrics(res.data as DashboardMetrics);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const handleGlobalSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await performGlobalSearchAction(query);
      if (res.success && res.data) {
        setSearchResults(res.data as { candidates: SearchCandidate[]; jobs: SearchJob[]; logs: SearchLog[] });
      }
    } catch {
      setSearchResults(null);
    }
  };

  const handleRunAutoDelete = async () => {
    setPurging(true);
    try {
      const res = await runAutoDeleteAction();
      if (res.success) {
        toast({ title: "Auto-Delete Complete", description: res.message, variant: "success" });
      } else {
        toast({ title: "Auto-Delete Failed", description: res.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to run auto-delete system check.", variant: "destructive" });
    } finally {
      setPurging(false);
    }
  };

  const storageMb = (metrics.storageUsedBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Admin Intelligence Control Center"
          subtitle="Real-time candidate statistics, application review queues, 9-stage pipeline, and system monitoring."
        />

        <div className="flex items-center gap-3">
          <NotificationCenter />
          <Button
            onClick={handleRunAutoDelete}
            disabled={purging}
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50 font-bold gap-2 text-xs rounded-xl"
          >
            <Trash2 className="h-4 w-4" />
            {purging ? "Purging..." : "Auto-Delete Check"}
          </Button>
        </div>
      </div>

      <Card className="border-[#D7E8D8] bg-white p-4 shadow-sm space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Global search across candidates, CNIC, jobs, payments, and system audit logs..."
            value={searchQuery}
            onChange={(e) => handleGlobalSearch(e.target.value)}
            className="pl-10 border-[#D7E8D8] bg-[#F8FAF8]"
          />
        </div>

        {searchResults && (
          <div className="rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] p-4 text-xs space-y-3">
            <h4 className="font-extrabold text-[#167A3D]">Search Results for &ldquo;{searchQuery}&rdquo;</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-slate-800">Candidates Found:</span>
                {searchResults.candidates.length === 0 ? (
                  <p className="text-slate-500 italic mt-1">No matching candidates.</p>
                ) : (
                  <ul className="mt-1 space-y-1">
                    {searchResults.candidates.map((c) => (
                      <li key={c.id} className="font-semibold text-slate-700">
                        {c.fullName} ({c.cnic}) - {c.status}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <span className="font-bold text-slate-800">Jobs Found:</span>
                {searchResults.jobs.length === 0 ? (
                  <p className="text-slate-500 italic mt-1">No matching jobs.</p>
                ) : (
                  <ul className="mt-1 space-y-1">
                    {searchResults.jobs.map((j) => (
                      <li key={j.id} className="font-semibold text-slate-700">
                        {j.title} ({j.country}) - {j.status}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Candidates"
          value={loading ? "..." : metrics.totalCandidates}
          description="Registered candidate profiles"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Pending Applications"
          value={loading ? "..." : metrics.pendingApplications}
          description="Awaiting admin decision"
          icon={<Clock className="h-5 w-5" />}
        />
        <MetricCard
          title="Approved Applications"
          value={loading ? "..." : metrics.approvedApplications}
          description="Verified overseas deployment"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <MetricCard
          title="Rejected Applications"
          value={loading ? "..." : metrics.rejectedApplications}
          description="Ineligible application files"
          icon={<XCircle className="h-5 w-5" />}
        />
        <MetricCard
          title="Pending Payments"
          value={loading ? "..." : metrics.pendingPayments}
          description="Submitted verification proof"
          icon={<CreditCard className="h-5 w-5" />}
        />
        <MetricCard
          title="Today's Registrations"
          value={loading ? "..." : metrics.todayRegistrations}
          description="New candidate signups today"
          icon={<UserCheck className="h-5 w-5" />}
        />
        <MetricCard
          title="Documents Uploaded"
          value={loading ? "..." : metrics.documentsUploaded}
          description="Cloudflare R2 vault objects"
          icon={<FileText className="h-5 w-5" />}
        />
        <MetricCard
          title="R2 Storage Used"
          value={loading ? "..." : `${storageMb} MB`}
          description="Cloudflare R2 bucket usage"
          icon={<HardDrive className="h-5 w-5" />}
        />
      </div>

      <Card className="border-[#D7E8D8] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 text-base font-bold">Quick Administrative Workflows</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Link href="/admin/jobs">
            <div className="rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] p-4 hover:border-[#167A3D] transition-colors cursor-pointer space-y-1">
              <Briefcase className="h-5 w-5 text-[#167A3D] mb-1" />
              <h4 className="font-bold text-slate-900 text-sm">Job Management</h4>
              <p className="text-xs text-slate-500">Post, edit, duplicate, and publish overseas vacancies.</p>
            </div>
          </Link>

          <Link href="/admin/pipeline">
            <div className="rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] p-4 hover:border-[#167A3D] transition-colors cursor-pointer space-y-1">
              <GitMerge className="h-5 w-5 text-[#167A3D] mb-1" />
              <h4 className="font-bold text-slate-900 text-sm">Recruitment Pipeline</h4>
              <p className="text-xs text-slate-500">Manage 9-stage deployment, interviews, visas, and flight tickets.</p>
            </div>
          </Link>

          <Link href="/admin/cms">
            <div className="rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] p-4 hover:border-[#167A3D] transition-colors cursor-pointer space-y-1">
              <Globe className="h-5 w-5 text-[#167A3D] mb-1" />
              <h4 className="font-bold text-slate-900 text-sm">Website CMS</h4>
              <p className="text-xs text-slate-500">Edit homepage hero, services, about, and legal policies.</p>
            </div>
          </Link>

          <Link href="/admin/applications">
            <div className="rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] p-4 hover:border-[#167A3D] transition-colors cursor-pointer space-y-1">
              <FileText className="h-5 w-5 text-[#167A3D] mb-1" />
              <h4 className="font-bold text-slate-900 text-sm">Applications Directory</h4>
              <p className="text-xs text-slate-500">Search and approve candidate profiles & documents.</p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
