"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { FileText, Upload, CreditCard, ArrowRight, ShieldCheck, Clock, UserCheck } from "lucide-react";
import { getCurrentCandidateProfileAction } from "@/actions/candidate.actions";
import { getCandidateDocumentsAction } from "@/actions/document.actions";
import { CandidateStatus, VerificationStatus } from "@/types";

interface CandidateInfo {
  id: string;
  fullName: string;
  email: string;
  cnic: string;
  status: CandidateStatus;
  paymentStatus: VerificationStatus;
}

export default function CandidateDashboardPage() {
  const [candidate, setCandidate] = useState<CandidateInfo | null>(null);
  const [uploadedCount, setUploadedCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, docsRes] = await Promise.all([
          getCurrentCandidateProfileAction(),
          getCandidateDocumentsAction(),
        ]);

        if (profileRes.success && profileRes.data) {
          setCandidate(profileRes.data as CandidateInfo);
        }

        if (docsRes.success && Array.isArray(docsRes.data)) {
          setUploadedCount(docsRes.data.length);
        }
      } catch {
        // Fallback
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#167A3D] to-[#0E5D2E] p-6 text-white shadow-lg">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">
                {candidate?.fullName ? `Welcome back, ${candidate.fullName}` : "Welcome to Candidate Portal"}
              </h1>
            </div>
            {candidate?.email && (
              <p className="text-xs text-emerald-200 mt-0.5 flex items-center gap-1 font-semibold">
                <UserCheck className="h-3.5 w-3.5" /> Account: {candidate.email} {candidate.cnic ? `| CNIC: ${candidate.cnic}` : ""}
              </p>
            )}
            <p className="text-xs text-emerald-100/90 mt-1">
              Ghazi Overseas Employment Pakistan (O.E.P LIC No. 2636/KARACHI)
            </p>
          </div>
          <Link href="/candidate/application">
            <Button className="bg-white text-[#167A3D] hover:bg-emerald-50 font-bold rounded-xl shadow mt-4 md:mt-0">
              View My Application <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Application Status */}
        <Card className="border-[#D7E8D8] bg-white shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-700">Application Status</CardTitle>
            <Clock className="h-5 w-5 text-[#167A3D]" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-black text-slate-900">
              <StatusBadge status={candidate?.status || "registered"} />
            </div>
            <p className="text-xs text-slate-500">
              Your candidate profile registration is complete. Upload documents to submit.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Documents Uploaded */}
        <Card className="border-[#D7E8D8] bg-white shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-700">Documents Uploaded</CardTitle>
            <Upload className="h-5 w-5 text-[#167A3D]" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-black text-[#167A3D]">
              {uploadedCount} / 4 <span className="text-xs font-normal text-slate-500">Required</span>
            </div>
            <p className="text-xs text-slate-500">
              Passport, CNIC, CV, and Trade Photo required for submission.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Payment Status */}
        <Card className="border-[#D7E8D8] bg-white shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-700">Payment Status</CardTitle>
            <CreditCard className="h-5 w-5 text-[#167A3D]" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-black text-slate-900">
              <StatusBadge status={candidate?.paymentStatus || "pending_payment"} />
            </div>
            <p className="text-xs text-slate-500">
              Submission Fee: Rs. 500 (Payable via Bank Transfer, EasyPaisa, or JazzCash).
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">Candidate Action Center</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/candidate/documents" className="block">
            <Card className="p-5 border-[#D7E8D8] hover:border-[#167A3D] transition-all bg-white hover:bg-emerald-50/50 group">
              <Upload className="h-6 w-6 text-[#167A3D] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-slate-900 text-base">Upload Documents</h3>
              <p className="text-xs text-slate-500 mt-1">Upload Passport, CNIC, and CV directly to Cloudflare R2 vault.</p>
            </Card>
          </Link>

          <Link href="/candidate/application" className="block">
            <Card className="p-5 border-[#D7E8D8] hover:border-[#167A3D] transition-all bg-white hover:bg-emerald-50/50 group">
              <FileText className="h-6 w-6 text-[#167A3D] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-slate-900 text-base">Review Application</h3>
              <p className="text-xs text-slate-500 mt-1">View profile summary and dynamic payment instructions.</p>
            </Card>
          </Link>

          <Link href="/candidate/payment" className="block">
            <Card className="p-5 border-[#D7E8D8] hover:border-[#167A3D] transition-all bg-white hover:bg-emerald-50/50 group">
              <CreditCard className="h-6 w-6 text-[#167A3D] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-slate-900 text-base">Submit Payment</h3>
              <p className="text-xs text-slate-500 mt-1">Enter Transaction Reference ID for fee verification.</p>
            </Card>
          </Link>

          <Link href="/candidate/tracker" className="block">
            <Card className="p-5 border-[#D7E8D8] hover:border-[#167A3D] transition-all bg-white hover:bg-emerald-50/50 group">
              <ShieldCheck className="h-6 w-6 text-[#167A3D] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-slate-900 text-base">Track Application</h3>
              <p className="text-xs text-slate-500 mt-1">Visual 6-step progress tracker for your recruitment file.</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
