"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import {
  Calendar,
  Stethoscope,
  FileCheck,
  Plane,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  updatePipelineStageAction,
  scheduleInterviewAction,
  updateMedicalTrackingAction,
  updateVisaTrackingAction,
  issueFlightTicketAction,
} from "@/actions/pipeline.actions";

interface CandidatePipelineRow {
  id: string;
  candidateId: string;
  candidateName: string;
  cnic: string;
  jobTitle: string;
  country: string;
  stage: string;
  interviewDate?: string;
  medicalStatus?: string;
  visaStatus?: string;
  flightPnr?: string;
}

export default function AdminPipelinePage() {
  const { toast } = useToast();

  const [applications, setApplications] = useState<CandidatePipelineRow[]>([
    {
      id: "app_101",
      candidateId: "cand_1",
      candidateName: "Muhammad Ali",
      cnic: "42101-1234567-1",
      jobTitle: "Heavy Duty Truck Driver",
      country: "Saudi Arabia",
      stage: "documents_verified",
      interviewDate: "None",
      medicalStatus: "pending",
      visaStatus: "pending",
    },
    {
      id: "app_102",
      candidateId: "cand_2",
      candidateName: "Tariq Mahmood",
      cnic: "42101-9988776-5",
      jobTitle: "6G Pipe Welder",
      country: "UAE",
      stage: "interview_scheduled",
      interviewDate: "2026-08-20 (Office)",
      medicalStatus: "passed",
      visaStatus: "submitted",
    },
    {
      id: "app_103",
      candidateId: "cand_3",
      candidateName: "Usman Ghani",
      cnic: "35202-1122334-9",
      jobTitle: "Electrician Specialist",
      country: "Qatar",
      stage: "ticket_issued",
      interviewDate: "Passed",
      medicalStatus: "passed",
      visaStatus: "approved",
      flightPnr: "PK-889900",
    },
  ]);

  const [interviewModal, setInterviewModal] = useState<{ open: boolean; app?: CandidatePipelineRow }>({ open: false });
  const [medicalModal, setMedicalModal] = useState<{ open: boolean; app?: CandidatePipelineRow }>({ open: false });
  const [visaModal, setVisaModal] = useState<{ open: boolean; app?: CandidatePipelineRow }>({ open: false });
  const [ticketModal, setTicketModal] = useState<{ open: boolean; app?: CandidatePipelineRow }>({ open: false });

  const [interviewForm, setInterviewForm] = useState<{
    interviewDate: string;
    interviewTime: string;
    mode: "online" | "office" | "phone";
    location: string;
    notes: string;
  }>({
    interviewDate: "2026-08-25",
    interviewTime: "10:00 AM",
    mode: "office",
    location: "Ghazi Overseas Head Office, Karachi",
    notes: "Bring original passport & CNIC.",
  });

  const [medicalForm, setMedicalForm] = useState<{
    status: "pending" | "passed" | "failed";
    medicalDate: string;
    medicalCenter: string;
    remarks: string;
  }>({
    status: "passed",
    medicalDate: "2026-08-22",
    medicalCenter: "GAMCA Approved Medical Center, Karachi",
    remarks: "Fit for overseas employment.",
  });

  const [visaForm, setVisaForm] = useState<{
    status: "pending" | "submitted" | "approved" | "rejected";
    visaNumber: string;
    issueDate: string;
    expiryDate: string;
    remarks: string;
  }>({
    status: "approved",
    visaNumber: "V-99882211",
    issueDate: "2026-08-24",
    expiryDate: "2027-08-24",
    remarks: "Work Visa Stamped.",
  });

  const [ticketForm, setTicketForm] = useState({
    airline: "PIA / Saudi Arabian Airlines",
    flightNumber: "PK-731",
    departureDate: "2026-09-01",
    departureAirport: "Karachi (KHI)",
    arrivalAirport: "Riyadh (RUH)",
    pnr: "PNR-GHAZI-99",
    seat: "14B",
  });

  const handleStageChange = async (appId: string, newStage: string) => {
    try {
      const res = await updatePipelineStageAction(appId, newStage);
      if (res.success) {
        setApplications(applications.map((a) => (a.id === appId ? { ...a, stage: newStage } : a)));
        toast({ title: "Stage Updated", description: res.message, variant: "success" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update pipeline stage.", variant: "destructive" });
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewModal.app) return;
    try {
      const res = await scheduleInterviewAction({
        applicationId: interviewModal.app.id,
        candidateId: interviewModal.app.candidateId,
        jobId: "job_sample_1",
        ...interviewForm,
      });
      if (res.success) {
        setApplications(applications.map((a) => (a.id === interviewModal.app?.id ? { ...a, stage: "interview_scheduled", interviewDate: `${interviewForm.interviewDate} (${interviewForm.mode})` } : a)));
        toast({ title: "Interview Scheduled", description: res.message, variant: "success" });
        setInterviewModal({ open: false });
      }
    } catch {
      toast({ title: "Error", description: "Failed to schedule interview.", variant: "destructive" });
    }
  };

  const handleUpdateMedical = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicalModal.app) return;
    try {
      const res = await updateMedicalTrackingAction({
        applicationId: medicalModal.app.id,
        candidateId: medicalModal.app.candidateId,
        ...medicalForm,
      });
      if (res.success) {
        setApplications(applications.map((a) => (a.id === medicalModal.app?.id ? { ...a, stage: "medical", medicalStatus: medicalForm.status } : a)));
        toast({ title: "Medical Record Updated", description: res.message, variant: "success" });
        setMedicalModal({ open: false });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update medical status.", variant: "destructive" });
    }
  };

  const handleUpdateVisa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visaModal.app) return;
    try {
      const res = await updateVisaTrackingAction({
        applicationId: visaModal.app.id,
        candidateId: visaModal.app.candidateId,
        ...visaForm,
      });
      if (res.success) {
        setApplications(applications.map((a) => (a.id === visaModal.app?.id ? { ...a, stage: "visa_processing", visaStatus: visaForm.status } : a)));
        toast({ title: "Visa Status Updated", description: res.message, variant: "success" });
        setVisaModal({ open: false });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update visa status.", variant: "destructive" });
    }
  };

  const handleIssueTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketModal.app) return;
    try {
      const res = await issueFlightTicketAction({
        applicationId: ticketModal.app.id,
        candidateId: ticketModal.app.candidateId,
        ...ticketForm,
      });
      if (res.success) {
        setApplications(applications.map((a) => (a.id === ticketModal.app?.id ? { ...a, stage: "ticket_issued", flightPnr: ticketForm.pnr } : a)));
        toast({ title: "Flight Ticket Issued", description: res.message, variant: "success" });
        setTicketModal({ open: false });
      }
    } catch {
      toast({ title: "Error", description: "Failed to issue ticket.", variant: "destructive" });
    }
  };

  const stagesList = [
    { key: "applied", label: "1. Applied" },
    { key: "documents_pending", label: "2. Docs Pending" },
    { key: "documents_verified", label: "3. Docs Verified" },
    { key: "interview_scheduled", label: "4. Interview" },
    { key: "medical", label: "5. GAMCA Medical" },
    { key: "visa_processing", label: "6. Visa Stamping" },
    { key: "ticket_issued", label: "7. Ticket Issued" },
    { key: "departure", label: "8. Departure" },
    { key: "completed", label: "9. Deployment Complete" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="9-Stage Recruitment Pipeline Board"
        subtitle="Track and transition candidate files across all 9 deployment stages from application to final flight departure."
      />

      <Card className="border-[#D7E8D8] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-slate-700 font-bold border-b border-[#D7E8D8]">
              <tr>
                <th className="p-4">Candidate & CNIC</th>
                <th className="p-4">Applied Job</th>
                <th className="p-4">Current Pipeline Stage</th>
                <th className="p-4">Interview</th>
                <th className="p-4">Medical</th>
                <th className="p-4">Visa</th>
                <th className="p-4 text-right">Pipeline Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E8D8] text-slate-700">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-[#F8FAF8] transition-colors">
                  <td className="p-4">
                    <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#167A3D]" /> {app.candidateName}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400">{app.cnic}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-[#167A3D]">{app.jobTitle}</p>
                    <p className="text-[10px] text-slate-500">{app.country}</p>
                  </td>
                  <td className="p-4">
                    <select
                      value={app.stage}
                      onChange={(e) => handleStageChange(app.id, e.target.value)}
                      className="rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] px-2.5 py-1 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#167A3D]"
                    >
                      {stagesList.map((st) => (
                        <option key={st.key} value={st.key}>
                          {st.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{app.interviewDate || "Not Set"}</td>
                  <td className="p-4 font-semibold capitalize text-slate-700">{app.medicalStatus || "Pending"}</td>
                  <td className="p-4 font-semibold capitalize text-slate-700">{app.visaStatus || "Pending"}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] font-bold border-[#D7E8D8] gap-1"
                        onClick={() => setInterviewModal({ open: true, app })}
                      >
                        <Calendar className="h-3 w-3 text-[#167A3D]" /> Interview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] font-bold border-[#D7E8D8] gap-1"
                        onClick={() => setMedicalModal({ open: true, app })}
                      >
                        <Stethoscope className="h-3 w-3 text-[#167A3D]" /> Medical
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] font-bold border-[#D7E8D8] gap-1"
                        onClick={() => setVisaModal({ open: true, app })}
                      >
                        <FileCheck className="h-3 w-3 text-[#167A3D]" /> Visa
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-[11px] font-bold bg-[#167A3D] text-white gap-1 rounded-xl"
                        onClick={() => setTicketModal({ open: true, app })}
                      >
                        <Plane className="h-3 w-3" /> Flight Ticket
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={interviewModal.open} onClose={() => setInterviewModal({ open: false })}>
        <form onSubmit={handleScheduleInterview} className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b border-[#D7E8D8] pb-2">
            Schedule Candidate Interview ({interviewModal.app?.candidateName})
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <div>
              <Label>Interview Date *</Label>
              <Input
                type="date"
                required
                value={interviewForm.interviewDate}
                onChange={(e) => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Interview Time *</Label>
              <Input
                required
                value={interviewForm.interviewTime}
                onChange={(e) => setInterviewForm({ ...interviewForm, interviewTime: e.target.value })}
              />
            </div>
            <div>
              <Label>Interview Mode *</Label>
              <select
                value={interviewForm.mode}
                onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value as "online" | "office" | "phone" })}
                className="w-full h-10 rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] px-3 font-bold"
              >
                <option value="office">Office In-Person</option>
                <option value="online">Online Video Call</option>
                <option value="phone">Phone Interview</option>
              </select>
            </div>
            <div>
              <Label>Location / Meeting Link</Label>
              <Input
                value={interviewForm.location}
                onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-[#167A3D] text-white font-bold">
            Confirm & Schedule Interview
          </Button>
        </form>
      </Dialog>

      <Dialog open={medicalModal.open} onClose={() => setMedicalModal({ open: false })}>
        <form onSubmit={handleUpdateMedical} className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b border-[#D7E8D8] pb-2">
            Medical Examination Tracking ({medicalModal.app?.candidateName})
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <Label>GAMCA Medical Status *</Label>
              <select
                value={medicalForm.status}
                onChange={(e) => setMedicalForm({ ...medicalForm, status: e.target.value as "pending" | "passed" | "failed" })}
                className="w-full h-10 rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] px-3 font-bold"
              >
                <option value="pending">Pending Examination</option>
                <option value="passed">Passed Medical (Fit)</option>
                <option value="failed">Failed Medical (Unfit)</option>
              </select>
            </div>
            <div>
              <Label>Medical Center Name</Label>
              <Input
                value={medicalForm.medicalCenter}
                onChange={(e) => setMedicalForm({ ...medicalForm, medicalCenter: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-[#167A3D] text-white font-bold">
            Save Medical Status
          </Button>
        </form>
      </Dialog>

      <Dialog open={visaModal.open} onClose={() => setVisaModal({ open: false })}>
        <form onSubmit={handleUpdateVisa} className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b border-[#D7E8D8] pb-2">
            Work Visa Stamping Status ({visaModal.app?.candidateName})
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <div>
              <Label>Visa Status *</Label>
              <select
                value={visaForm.status}
                onChange={(e) => setVisaForm({ ...visaForm, status: e.target.value as "pending" | "submitted" | "approved" | "rejected" })}
                className="w-full h-10 rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] px-3 font-bold"
              >
                <option value="pending">Pending Submission</option>
                <option value="submitted">Submitted to Embassy</option>
                <option value="approved">Approved & Stamped</option>
                <option value="rejected">Rejected by Embassy</option>
              </select>
            </div>
            <div>
              <Label>Visa Stamping Number</Label>
              <Input
                value={visaForm.visaNumber}
                onChange={(e) => setVisaForm({ ...visaForm, visaNumber: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-[#167A3D] text-white font-bold">
            Save Visa Stamping Record
          </Button>
        </form>
      </Dialog>

      <Dialog open={ticketModal.open} onClose={() => setTicketModal({ open: false })}>
        <form onSubmit={handleIssueTicket} className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b border-[#D7E8D8] pb-2">
            Issue Overseas Flight Ticket ({ticketModal.app?.candidateName})
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <div>
              <Label>Airline *</Label>
              <Input
                value={ticketForm.airline}
                onChange={(e) => setTicketForm({ ...ticketForm, airline: e.target.value })}
              />
            </div>
            <div>
              <Label>Flight Number *</Label>
              <Input
                value={ticketForm.flightNumber}
                onChange={(e) => setTicketForm({ ...ticketForm, flightNumber: e.target.value })}
              />
            </div>
            <div>
              <Label>Departure Date *</Label>
              <Input
                type="date"
                value={ticketForm.departureDate}
                onChange={(e) => setTicketForm({ ...ticketForm, departureDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Passenger PNR Code *</Label>
              <Input
                value={ticketForm.pnr}
                onChange={(e) => setTicketForm({ ...ticketForm, pnr: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-[#167A3D] text-white font-bold">
            Issue Ticket & Advance to Departure Stage
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
