"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Copy, Eye, EyeOff, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getPublicJobsAction,
  createJobAction,
  updateJobAction,
  deleteJobAction,
  duplicateJobAction,
} from "@/actions/job.actions";

interface JobRow {
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
  status: "draft" | "published" | "archived";
  createdAt: Date | string;
}

export default function AdminJobsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    country: "Saudi Arabia",
    city: "Riyadh",
    industry: "Transport & Logistics",
    trade: "Driver",
    employmentType: "Full Time",
    salary: 3000,
    currency: "SAR",
    contractDuration: "2 Years",
    workingHours: "8 Hours/Day",
    benefits: "Overtime + Medical",
    foodIncluded: true,
    accommodationIncluded: true,
    transportIncluded: true,
    medicalIncluded: true,
    airTicketIncluded: true,
    requiredExperience: 2,
    requiredEducation: "Matriculation",
    ageLimit: "21-45 Years",
    gender: "Male",
    vacancies: 10,
    deadline: "2026-12-31",
    description: "",
    responsibilities: "",
    requirements: "",
    status: "published" as const,
  });

  const loadJobs = async () => {
    try {
      const res = await getPublicJobsAction();
      if (res.success && res.data) {
        setJobs(res.data as JobRow[]);
      } else {
        setJobs([]);
      }
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createJobAction(formData);
      if (res.success) {
        toast({ title: "Job Created", description: `Job "${formData.title}" published successfully.`, variant: "success" });
        setCreateModalOpen(false);
        loadJobs();
      } else {
        toast({ title: "Creation Failed", description: res.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to create job.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "published" ? "draft" : "published";
      const res = await updateJobAction(id, { status: newStatus });
      if (res.success) {
        toast({ title: "Status Updated", description: `Job status set to ${newStatus.toUpperCase()}`, variant: "success" });
        loadJobs();
      }
    } catch {
      toast({ title: "Error", description: "Failed to update job status.", variant: "destructive" });
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await duplicateJobAction(id);
      if (res.success) {
        toast({ title: "Job Duplicated", description: "Job cloned as draft copy.", variant: "success" });
        loadJobs();
      }
    } catch {
      toast({ title: "Error", description: "Failed to duplicate job.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      const res = await deleteJobAction(id);
      if (res.success) {
        toast({ title: "Job Deleted", description: `Job "${title}" deleted from database.`, variant: "success" });
        loadJobs();
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete job.", variant: "destructive" });
    }
  };

  const filtered = jobs.filter(
    (j) =>
      !search ||
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      j.country?.toLowerCase().includes(search.toLowerCase()) ||
      j.trade?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Job Management Console"
          subtitle="Create, edit, duplicate, archive, and publish overseas job vacancies."
        />
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold gap-2 self-start md:self-auto rounded-xl"
        >
          <Plus className="h-4 w-4" /> Post New Job Vacancy
        </Button>
      </div>

      <Card className="border-[#D7E8D8] bg-white p-4 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search jobs by title, company, country, trade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-[#D7E8D8] bg-[#F8FAF8]"
          />
        </div>
      </Card>

      <Card className="border-[#D7E8D8] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-slate-700 font-bold border-b border-[#D7E8D8]">
              <tr>
                <th className="p-4">Job Title</th>
                <th className="p-4">Company Name</th>
                <th className="p-4">Country & City</th>
                <th className="p-4">Trade</th>
                <th className="p-4">Salary</th>
                <th className="p-4">Vacancies</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E8D8] text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-semibold">
                    Loading jobs database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-semibold">
                    No jobs posted in database.
                  </td>
                </tr>
              ) : (
                filtered.map((j) => (
                  <tr key={j.id} className="hover:bg-[#F8FAF8] transition-colors">
                    <td className="p-4 font-extrabold text-slate-900">{j.title}</td>
                    <td className="p-4 font-bold text-slate-700">{j.companyName}</td>
                    <td className="p-4">{j.city}, {j.country}</td>
                    <td className="p-4 font-bold text-[#167A3D]">{j.trade}</td>
                    <td className="p-4 font-bold">{j.currency} {j.salary?.toLocaleString()}</td>
                    <td className="p-4 font-bold">{j.vacancies}</td>
                    <td className="p-4">
                      <Badge
                        variant={j.status === "published" ? "success" : "outline"}
                        className={j.status === "published" ? "bg-emerald-100 text-[#167A3D]" : "text-slate-600"}
                      >
                        {j.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-[#D7E8D8]"
                          onClick={() => handleTogglePublish(j.id, j.status)}
                        >
                          {j.status === "published" ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          {j.status === "published" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-[#D7E8D8]"
                          onClick={() => handleDuplicate(j.id)}
                        >
                          <Copy className="h-3 w-3" /> Duplicate
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(j.id, j.title)}
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <form onSubmit={handleCreateJob} className="space-y-4 max-h-[85vh] overflow-y-auto pr-2">
          <h3 className="text-lg font-bold text-slate-900 border-b border-[#D7E8D8] pb-2">
            Post New Overseas Job Vacancy
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="job-title">Job Title *</Label>
              <Input
                id="job-title"
                required
                placeholder="Heavy Duty Truck Driver"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                required
                placeholder="Al-Bawardi Logistics Co."
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                required
                placeholder="Saudi Arabia"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                required
                placeholder="Riyadh"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="trade">Trade Profession *</Label>
              <Input
                id="trade"
                required
                placeholder="Driver / Welder / Electrician"
                value={formData.trade}
                onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="salary">Monthly Salary *</Label>
              <Input
                id="salary"
                type="number"
                required
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="currency">Currency *</Label>
              <Input
                id="currency"
                required
                placeholder="SAR / AED / QAR"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="vacancies">Number of Vacancies *</Label>
              <Input
                id="vacancies"
                type="number"
                required
                value={formData.vacancies}
                onChange={(e) => setFormData({ ...formData, vacancies: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="requiredExperience">Experience (Years) *</Label>
              <Input
                id="requiredExperience"
                type="number"
                required
                value={formData.requiredExperience}
                onChange={(e) => setFormData({ ...formData, requiredExperience: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                required
                rows={3}
                placeholder="Overview of overseas job opening..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#D7E8D8]">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-[#167A3D] text-white">
              {submitting ? "Publishing Job..." : "Publish Job Vacancy"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
