"use client";

import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, ShieldCheck, FileCheck, CreditCard, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  icon: React.ComponentType<{ className?: string }>;
}

export default function CandidateTrackerPage() {
  const steps: TimelineStep[] = [
    {
      id: 1,
      title: "1. Registration Complete",
      description: "Candidate account & personal profile registered in Ghazi database.",
      status: "completed",
      icon: CheckCircle2,
    },
    {
      id: 2,
      title: "2. Documents Uploaded",
      description: "Passport, CNIC, and CV uploaded to Cloudflare R2 document vault.",
      status: "completed",
      icon: FileCheck,
    },
    {
      id: 3,
      title: "3. Application Submitted",
      description: "Application file compiled and submitted for recruitment review.",
      status: "current",
      icon: Clock,
    },
    {
      id: 4,
      title: "4. Payment Pending",
      description: "Submission fee transaction reference submitted by candidate.",
      status: "upcoming",
      icon: CreditCard,
    },
    {
      id: 5,
      title: "5. Payment Verified",
      description: "Admin verification of bank transfer / EasyPaisa / JazzCash receipt.",
      status: "upcoming",
      icon: ShieldCheck,
    },
    {
      id: 6,
      title: "6. Application Approved",
      description: "Final approval for overseas employer shortlist and visa processing.",
      status: "upcoming",
      icon: Award,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Status Tracker"
        subtitle="Live 6-step progress timeline for your Ghazi Overseas Employment file."
      />

      <Card className="border-[#D7E8D8] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#167A3D] text-lg font-bold">Recruitment Timeline Progress</CardTitle>
          <CardDescription className="text-xs">
            File Reference: GHAZI-APP-2026-8912 | Status: Application Submitted
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="relative space-y-8 before:absolute before:inset-0 before:left-6 before:h-full before:w-0.5 before:bg-[#D7E8D8]">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative flex items-start gap-4 group">
                  {/* Timeline Circle Node */}
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all z-10",
                      step.status === "completed" && "border-[#167A3D] bg-[#167A3D] text-white shadow-md shadow-[#167A3D]/20",
                      step.status === "current" && "border-[#167A3D] bg-white text-[#167A3D] ring-4 ring-emerald-100",
                      step.status === "upcoming" && "border-slate-300 bg-slate-100 text-slate-400"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Timeline Step Card */}
                  <div className="flex-1 rounded-2xl border border-[#D7E8D8] bg-[#F8FAF8] p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h4
                        className={cn(
                          "text-base font-extrabold",
                          step.status === "completed" && "text-[#167A3D]",
                          step.status === "current" && "text-slate-900",
                          step.status === "upcoming" && "text-slate-500"
                        )}
                      >
                        {step.title}
                      </h4>
                      {step.status === "completed" && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                          Completed
                        </span>
                      )}
                      {step.status === "current" && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
