"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileCheck,
  Award,
  Calendar,
  Stethoscope,
  Plane,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCandidatePipelineAction } from "@/actions/pipeline.actions";

interface PipelineState {
  stage: string;
  interview: {
    interviewDate: string;
    interviewTime: string;
    mode: string;
    location: string;
    status: string;
  } | null;
  medical: {
    status: string;
    medicalCenter: string;
  } | null;
  visa: {
    status: string;
    visaNumber: string;
  } | null;
  ticket: {
    airline: string;
    flightNumber: string;
    departureDate: string;
    pnr: string;
    seat: string;
  } | null;
}

export default function CandidateTrackerPage() {
  const [pipelineData, setPipelineData] = useState<PipelineState>({
    stage: "documents_verified",
    interview: {
      interviewDate: "2026-08-20",
      interviewTime: "10:30 AM",
      mode: "office",
      location: "Ghazi Overseas Head Office, Karachi",
      status: "scheduled",
    },
    medical: {
      status: "passed",
      medicalCenter: "GAMCA Approved Medical Center, Karachi",
    },
    visa: {
      status: "approved",
      visaNumber: "V-882299",
    },
    ticket: {
      airline: "Saudi Arabian Airlines",
      flightNumber: "SV-731",
      departureDate: "2026-09-01",
      pnr: "PNR-GHAZI-99",
      seat: "14B",
    },
  });

  useEffect(() => {
    async function loadPipeline() {
      try {
        const res = await getCandidatePipelineAction("demo_candidate_id");
        if (res.success && res.data) {
          setPipelineData(res.data as PipelineState);
        }
      } catch {
        // Fallback demo state
      }
    }
    loadPipeline();
  }, []);

  const stages = [
    { key: "applied", label: "1. Application Submitted", icon: FileCheck },
    { key: "documents_pending", label: "2. Documents Pending", icon: Clock },
    { key: "documents_verified", label: "3. Documents Verified", icon: CheckCircle2 },
    { key: "interview_scheduled", label: "4. Interview Scheduled", icon: Calendar },
    { key: "medical", label: "5. GAMCA Medical Exam", icon: Stethoscope },
    { key: "visa_processing", label: "6. Visa Stamping", icon: ShieldCheck },
    { key: "ticket_issued", label: "7. Flight Ticket Issued", icon: Plane },
    { key: "departure", label: "8. Airport Departure", icon: Plane },
    { key: "completed", label: "9. Deployment Complete", icon: Award },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === pipelineData.stage);
  const activeIndex = currentStageIndex === -1 ? 2 : currentStageIndex;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment Pipeline Tracker"
        subtitle="Live 9-stage progress timeline tracking your overseas employment file from application to flight departure."
      />

      {pipelineData.ticket && (
        <Card className="border-[#D7E8D8] bg-[#167A3D] text-white p-6 shadow-lg space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge variant="outline" className="border-emerald-400 bg-[#0E5D2E] text-emerald-100 font-bold gap-1">
                <Plane className="h-3.5 w-3.5" /> Flight Ticket Issued
              </Badge>
              <h3 className="text-xl font-black mt-2">Overseas Flight Confirmed</h3>
              <p className="text-xs text-emerald-100">
                Airline: {pipelineData.ticket.airline} | Flight: {pipelineData.ticket.flightNumber} | PNR: {pipelineData.ticket.pnr} | Seat: {pipelineData.ticket.seat}
              </p>
            </div>
            <Button
              onClick={() => alert("Downloading official flight ticket e-pass PDF from Cloudflare R2 vault...")}
              className="bg-white text-[#167A3D] hover:bg-emerald-50 font-black text-xs gap-2 rounded-xl px-6 py-5 shadow"
            >
              <Download className="h-4 w-4" /> Download Flight Ticket (PDF)
            </Button>
          </div>
        </Card>
      )}

      <Card className="border-[#D7E8D8] bg-white shadow-sm p-6 space-y-6">
        <h3 className="text-[#167A3D] text-lg font-bold border-b border-[#D7E8D8] pb-3">
          9-Stage Recruitment Progression Timeline
        </h3>

        <div className="relative space-y-6 before:absolute before:inset-0 before:left-5 before:h-full before:w-0.5 before:bg-[#D7E8D8]">
          {stages.map((st, idx) => {
            const Icon = st.icon;
            const isDone = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={st.key} className="relative flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all z-10 text-xs font-bold",
                    isDone && "border-[#167A3D] bg-[#167A3D] text-white shadow-md",
                    isCurrent && "border-[#167A3D] bg-white text-[#167A3D] ring-4 ring-emerald-100",
                    !isDone && !isCurrent && "border-slate-300 bg-slate-100 text-slate-400"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 rounded-2xl border border-[#D7E8D8] bg-[#F8FAF8] p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className={cn("text-sm font-extrabold", isDone && "text-[#167A3D]", isCurrent && "text-slate-900", !isDone && !isCurrent && "text-slate-500")}>
                      {st.label}
                    </h4>
                    {isDone && <Badge variant="success" className="bg-emerald-100 text-[#167A3D]">Completed</Badge>}
                    {isCurrent && <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">Current Stage</Badge>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
