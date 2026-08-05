"use client";

import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { TrendingUp, Award, Globe, Users, CheckCircle2 } from "lucide-react";

export default function AdminAnalyticsPage() {
  const topProfessions = [
    { name: "Electrician Specialist", count: 48, percentage: 38 },
    { name: "Certified Welder", count: 32, percentage: 25 },
    { name: "Heavy Duty Driver", count: 24, percentage: 19 },
    { name: "Registered Nurse", count: 12, percentage: 9 },
    { name: "Plumber / Pipefitter", count: 8, percentage: 6 },
  ];

  const topCountries = [
    { name: "Saudi Arabia (KSA)", count: 72, flag: "🇸🇦" },
    { name: "United Arab Emirates (UAE)", count: 28, flag: "🇦🇪" },
    { name: "State of Qatar", count: 14, flag: "🇶🇦" },
    { name: "Sultanate of Oman", count: 10, flag: "🇴🇲" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment Analytics & Trend Intelligence"
        subtitle="Visual analytics on candidate applications per month, approval ratios, top trade categories, and deployment countries."
      />

      {/* Top Stat Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#D7E8D8] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase">Monthly Growth</span>
              <h3 className="text-2xl font-black text-[#167A3D] mt-1">+28.5%</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-[#167A3D]" />
          </div>
        </Card>

        <Card className="border-[#D7E8D8] bg-[#ffffff] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase">Approval Rate</span>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">74.2%</h3>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
        </Card>

        <Card className="border-[#D7E8D8] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase">Pending Payments</span>
              <h3 className="text-2xl font-black text-blue-700 mt-1">7 Queue</h3>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="border-[#D7E8D8] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase">Top Destination</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Saudi Arabia</h3>
            </div>
            <Globe className="h-8 w-8 text-[#167A3D]" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Top Professions Progress Bar List */}
        <Card className="border-[#D7E8D8] bg-white shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="h-5 w-5 text-[#167A3D]" /> Top Candidate Trade Professions
          </h3>

          <div className="space-y-3">
            {topProfessions.map((p) => (
              <div key={p.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{p.name}</span>
                  <span className="text-[#167A3D]">{p.count} Candidates ({p.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 bg-[#F8FAF8] rounded-full overflow-hidden border border-[#D7E8D8]">
                  <div className="h-full bg-[#167A3D] rounded-full" style={{ width: `${p.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Destination Countries */}
        <Card className="border-[#D7E8D8] bg-white shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#167A3D]" /> Top Overseas Deployment Destinations
          </h3>

          <div className="space-y-3">
            {topCountries.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAF8] border border-[#D7E8D8]">
                <div className="flex items-center gap-3 font-bold text-slate-900 text-xs">
                  <span className="text-lg">{c.flag}</span>
                  <span>{c.name}</span>
                </div>
                <span className="font-extrabold text-[#167A3D] text-xs">{c.count} Shortlisted</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
