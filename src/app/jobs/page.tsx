"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building2, Briefcase, DollarSign, ArrowRight } from "lucide-react";
import { getPublicJobsAction } from "@/actions/job.actions";

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
  contractDuration: string;
  vacancies: number;
  foodIncluded: boolean;
  accommodationIncluded: boolean;
  requiredExperience: number;
  description: string;
  createdAt: Date | string;
}

export default function PublicJobsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "salary">("newest");
  const [jobList, setJobList] = useState<JobItem[]>([]);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await getPublicJobsAction({
          search,
          country: selectedCountry,
          sortBy,
          status: "published",
        });
        if (res.success && res.data) {
          setJobList(res.data as JobItem[]);
        }
      } catch {
        setJobList([]);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [search, selectedCountry, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-16 space-y-8">
      <div className="bg-[#167A3D] text-white py-12 px-4 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0E5D2E] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-100 border border-emerald-600">
            <Briefcase className="h-4 w-4" /> Overseas Employment Opportunities
          </div>
          <h1 className="text-3xl font-black md:text-5xl">Explore Verified Jobs Overseas</h1>
          <p className="text-sm md:text-base text-emerald-100 max-w-2xl">
            Browse verified job vacancies in Saudi Arabia, UAE, Qatar, Oman, and Kuwait. Apply securely through Ghazi Overseas Employment Pakistan (O.E.P LIC No. 2636/KARACHI).
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <Card className="border-[#D7E8D8] bg-white p-4 shadow-sm space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search job title, company, or trade (e.g. Electrician, Driver)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-[#D7E8D8] bg-[#F8FAF8]"
              />
            </div>

            <div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#167A3D]"
              >
                <option value="all">All Destination Countries</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Qatar">Qatar</option>
                <option value="Oman">Oman</option>
                <option value="Kuwait">Kuwait</option>
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "salary")}
                className="w-full h-10 rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#167A3D]"
              >
                <option value="newest">Sort by: Newest First</option>
                <option value="salary">Sort by: Highest Salary</option>
              </select>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-semibold animate-pulse">
            Loading overseas job vacancies...
          </div>
        ) : jobList.length === 0 ? (
          <Card className="border-[#D7E8D8] bg-white p-12 text-center space-y-3">
            <h3 className="text-lg font-bold text-slate-800">No Job Opportunities Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              There are currently no job openings matching your search criteria. Please try broadening your filters.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobList.map((job) => (
              <Card key={job.id} className="border-[#D7E8D8] bg-white shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="border-[#D7E8D8] bg-[#F8FAF8] text-[#167A3D] font-bold">
                      {job.trade}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <CardTitle className="text-lg font-black text-slate-900 mt-2 line-clamp-1">
                    {job.title}
                  </CardTitle>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold pt-1">
                    <Building2 className="h-3.5 w-3.5 text-[#167A3D]" />
                    <span className="truncate">{job.companyName}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F8FAF8] p-3 border border-[#D7E8D8] text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Location:</span>
                      <p className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-[#167A3D]" /> {job.city}, {job.country}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium">Salary:</span>
                      <p className="font-bold text-[#167A3D] flex items-center gap-1 mt-0.5">
                        <DollarSign className="h-3 w-3" /> {job.currency} {job.salary.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600">
                    <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[#167A3D] font-bold border border-emerald-100">
                      {job.vacancies} Vacancies
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-slate-700 font-semibold">
                      Exp: {job.requiredExperience}+ Yrs
                    </span>
                    {job.foodIncluded && (
                      <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[#167A3D] font-bold">
                        Food Included
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">{job.description}</p>
                </CardContent>

                <div className="p-4 pt-0 border-t border-[#D7E8D8] mt-4">
                  <Link href={`/jobs/${job.slug}`}>
                    <Button className="w-full bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-extrabold text-xs gap-1 rounded-xl shadow mt-3">
                      View Job & Apply <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
