"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitContactFormAction } from "@/actions/cms.actions";

export default function PublicContactPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitContactFormAction(formData);
      if (res.success) {
        toast({ title: "Inquiry Sent", description: res.message, variant: "success" });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast({ title: "Submission Failed", description: res.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-16 space-y-8">
      <div className="bg-[#167A3D] text-white py-12 px-4 shadow-md">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0E5D2E] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-100 border border-emerald-600">
            <Mail className="h-4 w-4" /> Official Assistance & Client Relations
          </div>
          <h1 className="text-3xl font-black md:text-5xl">Contact Ghazi Overseas</h1>
          <p className="text-sm md:text-base text-emerald-100 max-w-2xl">
            Get in touch with our head office team in Karachi or Islamabad for overseas deployment inquiries, employer recruitment demands, and candidate assistance.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="border-[#D7E8D8] bg-white p-6 shadow-sm md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b border-[#D7E8D8] pb-3">
              <Send className="h-5 w-5 text-[#167A3D]" /> Send Official Inquiry
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  placeholder="Muhammad Ali"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="ali@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone / WhatsApp *</Label>
                <Input
                  id="phone"
                  required
                  placeholder="03001234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject">Inquiry Subject *</Label>
                <Input
                  id="subject"
                  required
                  placeholder="Overseas Job Demand / Candidate Query"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="message">Message Details *</Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Describe your query or employer recruitment demand..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-extrabold text-sm gap-2 rounded-xl shadow-lg mt-2"
            >
              {submitting ? "Sending Inquiry..." : "Submit Official Message"} <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="border-[#D7E8D8] bg-white p-6 shadow-sm space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-[#D7E8D8] pb-2">
              Head Office Contact Info
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#167A3D] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Head Office Location</p>
                  <p className="text-slate-500">Commercial Zone, Karachi / Islamabad, Pakistan</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#167A3D] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Official Helpline</p>
                  <p className="text-slate-500">+92 (021) 111-GHAZI-0</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#167A3D] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Email Contact</p>
                  <p className="text-slate-500">info@ghazioverseas.pk</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-[#D7E8D8] bg-[#F8FAF8] p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#167A3D]">
              <ShieldCheck className="h-4 w-4" /> O.E.P License Certified
            </div>
            <p className="text-slate-600">
              Ghazi Overseas Employment Pakistan (O.E.P LIC No. 2636/KARACHI). Government of Pakistan Ministry of Overseas Pakistanis certified agency.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
