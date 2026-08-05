"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Megaphone, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllAnnouncementsAction, createAnnouncementAction } from "@/actions/cms.actions";

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  targetAudience: string;
  isImportant: boolean;
  createdAt: Date | string;
}

export default function AdminAnnouncementsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);

  const [form, setForm] = useState({
    title: "",
    content: "",
    targetAudience: "all",
    isImportant: true,
  });

  const [submitting, setSubmitting] = useState(false);

  const loadAnnouncements = async () => {
    try {
      const res = await getAllAnnouncementsAction();
      if (res.success && res.data) {
        setAnnouncements(res.data as AnnouncementItem[]);
      } else {
        setAnnouncements([]);
      }
    } catch {
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createAnnouncementAction(form);
      if (res.success) {
        toast({ title: "Announcement Published", description: res.message, variant: "success" });
        setForm({ title: "", content: "", targetAudience: "all", isImportant: true });
        loadAnnouncements();
      }
    } catch {
      toast({ title: "Error", description: "Failed to publish announcement.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agency Announcements Console"
        subtitle="Broadcast official announcements and urgent GAMCA/embassy notices to candidates and admin staff."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-[#D7E8D8] bg-white p-6 shadow-sm lg:col-span-1">
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-[#D7E8D8] pb-2">
              <Megaphone className="h-4 w-4 text-[#167A3D]" /> Post Announcement
            </h3>

            <div className="space-y-1.5">
              <Label htmlFor="ann-title">Announcement Title *</Label>
              <Input
                id="ann-title"
                required
                placeholder="GAMCA Medical Center Update"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ann-audience">Target Audience *</Label>
              <select
                id="ann-audience"
                value={form.targetAudience}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                className="w-full h-10 rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] px-3 font-bold text-slate-800"
              >
                <option value="all">All Portal Users (Candidates & Staff)</option>
                <option value="candidates">Candidates Only</option>
                <option value="admins">Admin Staff Only</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ann-content">Announcement Content *</Label>
              <Textarea
                id="ann-content"
                required
                rows={4}
                placeholder="Notice details..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isImportant"
                checked={form.isImportant}
                onChange={(e) => setForm({ ...form, isImportant: e.target.checked })}
                className="h-4 w-4 rounded border-[#D7E8D8] text-[#167A3D]"
              />
              <Label htmlFor="isImportant" className="font-bold text-slate-800 cursor-pointer">
                Mark as High Priority / Urgent
              </Label>
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-[#167A3D] text-white font-bold gap-2 rounded-xl">
              {submitting ? "Publishing..." : "Publish Announcement"} <Plus className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        <Card className="border-[#D7E8D8] bg-white p-6 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-[#D7E8D8] pb-2">
            Published Announcements ({announcements.length})
          </h3>

          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-slate-500 font-semibold p-8">Loading announcements...</p>
            ) : announcements.length === 0 ? (
              <p className="text-center text-slate-500 font-semibold p-8">No announcements posted.</p>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className="rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-[#167A3D]" /> {ann.title}
                    </span>
                    {ann.isImportant && (
                      <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Target: {ann.targetAudience.toUpperCase()} | Published: {new Date(ann.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
