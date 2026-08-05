"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getDashboardMetricsAction, runAutoDeleteAction } from "@/actions/admin.actions";

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

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [purging, setPurging] = useState(false);
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
          title="Admin Control Center"
          subtitle="Real-time candidate statistics, application review queues, R2 document storage, and system monitoring."
        />
        <Button
          onClick={handleRunAutoDelete}
          disabled={purging}
          variant="outline"
          className="border-red-200 text-red-700 hover:bg-red-50 font-bold gap-2 self-start md:self-auto rounded-xl"
        >
          <Trash2 className="h-4 w-4" />
          {purging ? "Purging Unapproved Applications..." : "Run 30-Day Auto-Delete Check"}
        </Button>
      </div>

      {/* 8 Summary Metric Cards */}
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

      {/* Quick Action Navigation Grid */}
      <Card className="border-[#D7E8D8] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 text-base font-bold">Quick Administrative Workflows</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link href="/admin/applications">
            <div className="rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] p-4 hover:border-[#167A3D] transition-colors cursor-pointer space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">Review Applications Directory</h4>
              <p className="text-xs text-slate-500">Search and filter candidates by CNIC, passport, or profession.</p>
            </div>
          </Link>

          <Link href="/admin/payments">
            <div className="rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] p-4 hover:border-[#167A3D] transition-colors cursor-pointer space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">Verify Submitted Payments</h4>
              <p className="text-xs text-slate-500">Approve transaction reference IDs (TID) and auto-approve candidates.</p>
            </div>
          </Link>

          <Link href="/admin/settings">
            <div className="rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] p-4 hover:border-[#167A3D] transition-colors cursor-pointer space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">Admin Portal & Fee Settings</h4>
              <p className="text-xs text-slate-500">Toggle payment methods, submission fee rules, and auto-delete limits.</p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
