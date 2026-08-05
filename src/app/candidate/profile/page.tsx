"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CandidateProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "Muhammad Ali",
    fatherName: "Tariq Ali",
    cnic: "42101-1234567-1",
    passportNumber: "AB9988771",
    phone: "03001234567",
    whatsapp: "03001234567",
    email: "candidate@example.com",
    city: "Karachi",
    province: "Sindh",
    profession: "Electrician Specialist",
    education: "DAE Electrical Diploma",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Profile Updated", description: "Candidate profile details saved successfully.", variant: "success" });
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Candidate Profile"
        subtitle="Manage your personal information, contact numbers, and professional trade credentials."
      />

      <Card className="border-[#D7E8D8] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#167A3D] text-lg font-bold">Personal & Professional Details</CardTitle>
          <CardDescription className="text-xs">
            Verify that all credentials match your official CNIC and Passport.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fatherName">Father&apos;s Name</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cnic">CNIC Number</Label>
                <Input id="cnic" value={formData.cnic} readOnly className="bg-slate-100" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="passportNumber">Passport Number</Label>
                <Input
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Mobile Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profession">Trade Profession</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="education">Education / Qualification</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold gap-2 rounded-xl mt-4"
            >
              {loading ? "Saving Changes..." : "Save Profile Details"} <Save className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
