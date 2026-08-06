"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle2, Search, Send, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPublicJobsAction, applyToJobAction } from "@/actions/job.actions";
import { getCurrentCandidateProfileAction } from "@/actions/candidate.actions";

interface JobItem {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  country: string;
  city: string;
  trade: string;
  salary: number;
  currency: string;
  vacancies: number;
  contractDuration: string;
  workingHours: string;
  benefits?: string;
  description: string;
  status: string;
}

export default function CandidateJobsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const res = await getPublicJobsAction();
      if (res.success && res.data) {
        setJobs(res.data as JobItem[]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId: string, jobTitle: string) => {
    setApplyingId(jobId);
    try {
      const profileRes = await getCurrentCandidateProfileAction();
      const candidateId = profileRes.success && profileRes.data ? profileRes.data.id : undefined;
      const res = await applyToJobAction(candidateId, jobId);
      if (res.success) {
        setAppliedJobIds((prev) => [...prev, jobId]);
        toast({
          title: "Application Submitted",
          description: `You have successfully applied for "${jobTitle}".`,
          variant: "success",
        });
      } else {
        toast({ title: "Application Failed", description: res.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to submit job application.", variant: "destructive" });
    } finally {
      setApplyingId(null);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName.toLowerCase().includes(search.toLowerCase()) ||
      j.trade.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = countryFilter === "all" || j.country.toLowerCase() === countryFilter.toLowerCase();
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Available Overseas Job Positions"
        subtitle="Browse verified government-approved overseas vacancies and apply directly with your registered profile."
      />

      <Card className="border-[#D7E8D8] bg-white p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by job title, trade profession, or employer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-[#D7E8D8] bg-[#F8FAF8]"
            />
          </div>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            aria-label="Filter by destination country"
            className="w-full md:w-56 h-10 rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#167A3D]"
          >
            <option value="all">All Countries</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Qatar">Qatar</option>
            <option value="UAE">United Arab Emirates</option>
            <option value="Oman">Oman</option>
            <option value="Kuwait">Kuwait</option>
          </select>
        </div>
      </Card>

      {loading ? (
        <div className="p-12 text-center text-sm font-semibold text-slate-500">
          Loading available job positions...
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="border-[#D7E8D8] bg-white p-12 text-center">
          <Briefcase className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">No Job Positions Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or country filter.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredJobs.map((j) => {
            const isApplied = appliedJobIds.includes(j.id);
            return (
              <Card key={j.id} className="border-[#D7E8D8] bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="outline" className="bg-[#167A3D]/10 text-[#167A3D] font-bold border-[#D7E8D8] text-[10px] mb-2">
                        {j.trade}
                      </Badge>
                      <CardTitle className="text-lg font-black text-slate-900">{j.title}</CardTitle>
                      <CardDescription className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-1">
                        <Building2 className="h-3.5 w-3.5 text-[#167A3D]" /> {j.companyName}
                      </CardDescription>
                    </div>
                    {isApplied && (
                      <Badge variant="success" className="bg-emerald-100 text-emerald-800 font-bold gap-1 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Applied
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs">
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F8FAF8] p-3 border border-[#D7E8D8] font-bold text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-[#167A3D]" />
                      <span>{j.city}, {j.country}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[#167A3D]">
                      <DollarSign className="h-4 w-4" />
                      <span>{j.currency} {j.salary?.toLocaleString()} / mo</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-[#167A3D]" />
                      <span>{j.contractDuration || "2 Years"}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-900">
                      <Briefcase className="h-4 w-4 text-[#167A3D]" />
                      <span>{j.vacancies} Vacancies</span>
                    </div>
                  </div>

                  <p className="text-slate-600 line-clamp-2 leading-relaxed text-xs">
                    {j.description}
                  </p>
                </CardContent>

                <CardFooter className="border-t border-[#D7E8D8] pt-3 flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="w-full text-xs font-bold border-[#D7E8D8]"
                    onClick={() => setSelectedJob(j)}
                  >
                    View Details
                  </Button>

                  <Button
                    onClick={() => handleApply(j.id, j.title)}
                    disabled={isApplied || applyingId === j.id}
                    className="w-full bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-extrabold text-xs gap-1.5 shadow-md"
                  >
                    {isApplied ? (
                      <>Applied <CheckCircle2 className="h-3.5 w-3.5" /></>
                    ) : applyingId === j.id ? (
                      "Applying..."
                    ) : (
                      <>Apply Now <Send className="h-3.5 w-3.5" /></>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Job Details Modal */}
      <Dialog open={!!selectedJob} onClose={() => setSelectedJob(null)}>
        {selectedJob && (
          <div className="space-y-4 max-w-lg mx-auto text-xs">
            <h3 className="text-lg font-black text-slate-900 border-b border-[#D7E8D8] pb-2">
              {selectedJob.title}
            </h3>

            <div className="space-y-2">
              <p className="font-bold text-slate-700">Employer: <span className="text-slate-900">{selectedJob.companyName}</span></p>
              <p className="font-bold text-slate-700">Location: <span className="text-slate-900">{selectedJob.city}, {selectedJob.country}</span></p>
              <p className="font-bold text-[#167A3D]">Monthly Salary: <span className="font-extrabold">{selectedJob.currency} {selectedJob.salary?.toLocaleString()}</span></p>
              <p className="font-bold text-slate-700">Contract Duration: <span className="text-slate-900">{selectedJob.contractDuration}</span></p>
              <p className="font-bold text-slate-700">Working Hours: <span className="text-slate-900">{selectedJob.workingHours}</span></p>
              {selectedJob.benefits && <p className="font-bold text-slate-700">Benefits: <span className="text-slate-900">{selectedJob.benefits}</span></p>}
            </div>

            <div className="border-t border-[#D7E8D8] pt-2">
              <h4 className="font-bold text-slate-900 mb-1">Job Description & Scope:</h4>
              <p className="text-slate-600 leading-relaxed">{selectedJob.description}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#D7E8D8]">
              <Button variant="outline" onClick={() => setSelectedJob(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  handleApply(selectedJob.id, selectedJob.title);
                  setSelectedJob(null);
                }}
                disabled={appliedJobIds.includes(selectedJob.id)}
                className="bg-[#167A3D] text-white font-extrabold"
              >
                {appliedJobIds.includes(selectedJob.id) ? "Applied" : "Submit Application"}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
