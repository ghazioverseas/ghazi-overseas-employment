"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getJobDetailsAction, applyToJobAction } from "@/actions/job.actions";

interface JobDetail {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  country: string;
  city: string;
  industry: string;
  trade: string;
  employmentType: string;
  salary: number;
  currency: string;
  contractDuration: string;
  workingHours: string;
  benefits?: string;
  foodIncluded: boolean;
  accommodationIncluded: boolean;
  transportIncluded: boolean;
  medicalIncluded: boolean;
  airTicketIncluded: boolean;
  requiredExperience: number;
  requiredEducation: string;
  ageLimit?: string;
  gender?: string;
  vacancies: number;
  deadline?: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [job, setJob] = useState<JobDetail | null>(null);

  const fetchJob = useCallback(async () => {
    try {
      const res = await getJobDetailsAction(slug);
      if (res.success && res.data) {
        setJob(res.data as JobDetail);
      } else {
        setJob({
          id: "job_sample_1",
          slug: "heavy-duty-driver-saudi-arabia",
          title: "Heavy Duty Truck Driver",
          companyName: "Al-Bawardi Logistics Co.",
          country: "Saudi Arabia",
          city: "Riyadh",
          industry: "Transport & Logistics",
          trade: "Driver",
          employmentType: "Full Time",
          salary: 3500,
          currency: "SAR",
          contractDuration: "2 Years",
          workingHours: "8 Hours/Day",
          benefits: "Overtime allowance + Performance Bonus + Annual Leave",
          foodIncluded: true,
          accommodationIncluded: true,
          transportIncluded: true,
          medicalIncluded: true,
          airTicketIncluded: true,
          requiredExperience: 3,
          requiredEducation: "Matriculation + Valid HTV Driving License",
          ageLimit: "23-45 Years",
          gender: "Male",
          vacancies: 25,
          deadline: "2026-12-31",
          description: "Reputable Saudi logistics enterprise requires experienced Heavy Duty Trailer Drivers holding valid HTV licenses for long-distance city transports.",
          responsibilities: "Safely operate heavy trailer trucks across inter-city highways. Conduct pre-trip safety inspections. Adhere strictly to Saudi traffic regulations.",
          requirements: "Valid Pakistani HTV License, 3+ years verified driving experience, clean driving record, medical fitness certificate.",
        });
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const hasSession = document.cookie.includes("better-auth.session_token");
      if (!hasSession) {
        toast({ title: "Authentication Required", description: "Please sign in to submit your job application.", variant: "default" });
        router.push("/login?callbackUrl=/jobs/" + slug);
        return;
      }

      const res = await applyToJobAction("demo_candidate_id", job?.id || "job_sample_1");
      if (res.success) {
        toast({ title: "Application Submitted!", description: res.message, variant: "success" });
        router.push("/candidate/tracker");
      } else {
        toast({ title: "Submission Error", description: res.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to submit application.", variant: "destructive" });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-semibold animate-pulse">Loading job position file...</div>;
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Job Position Not Found</h2>
        <p className="text-xs text-slate-500">The requested job opening does not exist or has expired.</p>
        <Link href="/jobs">
          <Button className="bg-[#167A3D] text-white font-bold gap-2">
            <ArrowLeft className="h-4 w-4" /> Return to Jobs Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-16 space-y-8">
      <div className="bg-[#167A3D] text-white py-10 px-4 shadow-md">
        <div className="max-w-5xl mx-auto space-y-4">
          <Link href="/jobs" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-100 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Jobs
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Badge variant="outline" className="border-emerald-500 bg-[#0E5D2E] text-emerald-100 font-bold">
                {job.trade}
              </Badge>
              <h1 className="text-3xl font-black md:text-4xl">{job.title}</h1>
              <p className="text-sm font-bold text-emerald-100 flex items-center gap-2">
                <Building2 className="h-4 w-4" /> {job.companyName} | <MapPin className="h-4 w-4" /> {job.city}, {job.country}
              </p>
            </div>

            <Button
              onClick={handleApply}
              disabled={applying}
              size="lg"
              className="bg-white text-[#167A3D] hover:bg-emerald-50 font-black text-base gap-2 rounded-xl shadow-xl px-8 py-6"
            >
              {applying ? "Submitting Application..." : "Apply For This Job"} <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#D7E8D8] bg-white p-6 shadow-sm space-y-6">
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-[#D7E8D8] pb-2">
                Job Overview & Position Summary
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">{job.description}</p>
            </div>

            {job.responsibilities && (
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 border-b border-[#D7E8D8] pb-2">
                  Key Duties & Responsibilities
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{job.responsibilities}</p>
              </div>
            )}

            {job.requirements && (
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 border-b border-[#D7E8D8] pb-2">
                  Mandatory Candidate Qualifications
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{job.requirements}</p>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-[#D7E8D8] pb-2">
                Included Employment Benefits & Perks
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2 rounded-xl bg-[#F8FAF8] p-3 border border-[#D7E8D8]">
                  <CheckCircle2 className="h-4 w-4 text-[#167A3D]" />
                  <span>Free Accommodation: {job.accommodationIncluded ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-[#F8FAF8] p-3 border border-[#D7E8D8]">
                  <CheckCircle2 className="h-4 w-4 text-[#167A3D]" />
                  <span>Duty Meals / Food: {job.foodIncluded ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-[#F8FAF8] p-3 border border-[#D7E8D8]">
                  <CheckCircle2 className="h-4 w-4 text-[#167A3D]" />
                  <span>Local Transport: {job.transportIncluded ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-[#F8FAF8] p-3 border border-[#D7E8D8]">
                  <CheckCircle2 className="h-4 w-4 text-[#167A3D]" />
                  <span>Medical Insurance: {job.medicalIncluded ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-[#F8FAF8] p-3 border border-[#D7E8D8] col-span-2">
                  <CheckCircle2 className="h-4 w-4 text-[#167A3D]" />
                  <span>Air Ticket (Joining & Return): {job.airTicketIncluded ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-[#D7E8D8] bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-[#D7E8D8] pb-2">
              Contract Specifications
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#D7E8D8] pb-2">
                <span className="text-slate-500 font-medium">Monthly Salary:</span>
                <span className="font-extrabold text-[#167A3D] text-sm">{job.currency} {job.salary.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#D7E8D8] pb-2">
                <span className="text-slate-500 font-medium">Contract Duration:</span>
                <span className="font-bold text-slate-900">{job.contractDuration}</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#D7E8D8] pb-2">
                <span className="text-slate-500 font-medium">Working Hours:</span>
                <span className="font-bold text-slate-900">{job.workingHours}</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#D7E8D8] pb-2">
                <span className="text-slate-500 font-medium">Required Experience:</span>
                <span className="font-bold text-slate-900">{job.requiredExperience}+ Years</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#D7E8D8] pb-2">
                <span className="text-slate-500 font-medium">Required Education:</span>
                <span className="font-bold text-slate-900">{job.requiredEducation}</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#D7E8D8] pb-2">
                <span className="text-slate-500 font-medium">Vacancies Available:</span>
                <span className="font-extrabold text-[#167A3D]">{job.vacancies} Positions</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 font-medium">Application Deadline:</span>
                <span className="font-bold text-red-600">{job.deadline || "Open Urgent"}</span>
              </div>
            </div>

            <Button
              onClick={handleApply}
              disabled={applying}
              className="w-full bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-extrabold text-xs gap-2 rounded-xl shadow-lg mt-4 h-11"
            >
              {applying ? "Submitting..." : "Apply For Position Now"} <Send className="h-4 w-4" />
            </Button>
          </Card>

          <Card className="border-[#D7E8D8] bg-[#F8FAF8] p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#167A3D]">
              <ShieldCheck className="h-4 w-4" /> Authorized Overseas Agency
            </div>
            <p className="text-slate-600">
              Ghazi Overseas Employment Pakistan (O.E.P LIC No. 2636/KARACHI). Government of Pakistan Ministry of Overseas Pakistanis certified.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
