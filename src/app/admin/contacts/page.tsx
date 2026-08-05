"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllContactSubmissionsAction, replyToContactSubmissionAction } from "@/actions/cms.actions";

interface ContactRow {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "replied" | "archived";
  replyMessage?: string;
  createdAt: Date | string;
}

export default function AdminContactsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<ContactRow[]>([]);
  const [replyModal, setReplyModal] = useState<{ open: boolean; item?: ContactRow }>({ open: false });
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadInquiries = async () => {
    try {
      const res = await getAllContactSubmissionsAction();
      if (res.success && res.data) {
        setInquiries(res.data as ContactRow[]);
      } else {
        setInquiries([]);
      }
    } catch {
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModal.item) return;
    setSubmitting(true);
    try {
      const res = await replyToContactSubmissionAction(replyModal.item.id, replyText);
      if (res.success) {
        toast({ title: "Reply Sent", description: `Response sent to ${replyModal.item.email}`, variant: "success" });
        setReplyModal({ open: false });
        setReplyText("");
        loadInquiries();
      }
    } catch {
      toast({ title: "Error", description: "Failed to send reply.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Public Website Inquiries Console"
        subtitle="Review messages and employer recruitment demand inquiries submitted via the website contact form."
      />

      <Card className="border-[#D7E8D8] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-slate-700 font-bold border-b border-[#D7E8D8]">
              <tr>
                <th className="p-4">Applicant / Employer Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E8D8] text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                    Loading contact inquiries...
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                    No contact form submissions recorded.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#F8FAF8] transition-colors">
                    <td className="p-4 font-bold text-slate-900">{inq.name}</td>
                    <td className="p-4 font-medium">{inq.email}</td>
                    <td className="p-4">{inq.phone || "N/A"}</td>
                    <td className="p-4 font-bold text-[#167A3D]">{inq.subject}</td>
                    <td className="p-4">
                      <Badge
                        variant={inq.status === "replied" ? "success" : "outline"}
                        className={inq.status === "replied" ? "bg-emerald-100 text-[#167A3D]" : "border-amber-300 bg-amber-50 text-amber-800"}
                      >
                        {inq.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        className="bg-[#167A3D] text-white font-bold gap-1 rounded-xl text-xs"
                        onClick={() => {
                          setReplyModal({ open: true, item: inq });
                          setReplyText(inq.replyMessage || "");
                        }}
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Reply
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={replyModal.open} onClose={() => setReplyModal({ open: false })}>
        <form onSubmit={handleSendReply} className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b border-[#D7E8D8] pb-2">
            Reply to Inquiry from {replyModal.item?.name}
          </h3>
          <div className="space-y-3 text-xs">
            <div className="rounded-xl bg-[#F8FAF8] p-3 border border-[#D7E8D8] space-y-1">
              <p className="font-bold text-slate-900">Subject: {replyModal.item?.subject}</p>
              <p className="text-slate-600 italic">&ldquo;{replyModal.item?.message}&rdquo;</p>
            </div>

            <div>
              <Textarea
                required
                rows={4}
                placeholder="Type your official reply message here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-[#167A3D] text-white font-bold gap-2">
            {submitting ? "Sending..." : "Dispatch Reply"} <Send className="h-4 w-4" />
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
