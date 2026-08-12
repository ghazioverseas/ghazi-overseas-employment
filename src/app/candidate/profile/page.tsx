"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Save, Loader2, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentCandidateProfileAction, updateCandidateProfileAction } from "@/actions/candidate.actions";

export default function CandidateProfilePage() {
  const { toast } = useToast();
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    cnic: "",
    passportNumber: "",
    noPassport: false,
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    province: "",
    profession: "",
    education: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      setFetching(true);
      try {
        const res = await getCurrentCandidateProfileAction();
        if (res.success && res.data) {
          const cand = res.data;
          const rawPass = cand.passportNumber || "";
          const noPass = rawPass === "N/A" || !rawPass;
          setFormData({
            fullName: cand.fullName || "",
            fatherName: cand.fatherName || "",
            cnic: cand.cnic || "",
            passportNumber: noPass ? "" : rawPass,
            noPassport: noPass,
            phone: cand.phone || "",
            whatsapp: cand.whatsapp || "",
            email: cand.email || "",
            city: cand.city || "",
            province: cand.province || "",
            profession: cand.profession || "",
            education: cand.education || "",
          });
        } else {
          toast({
            title: "Profile Error",
            description: res.error || "Failed to load candidate profile details.",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Profile Error",
          description: "An unexpected error occurred while loading profile.",
          variant: "destructive",
        });
      } finally {
        setFetching(false);
      }
    }

    fetchProfile();
  }, [toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.noPassport && (!formData.passportNumber || formData.passportNumber.trim() === "")) {
      toast({
        title: "Validation Error",
        description: "Passport Number is mandatory unless 'I don't have a passport' is checked.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await updateCandidateProfileAction({
        fullName: formData.fullName,
        fatherName: formData.fatherName,
        cnic: formData.cnic,
        passportNumber: formData.noPassport ? "N/A" : formData.passportNumber.trim(),
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        city: formData.city,
        province: formData.province,
        profession: formData.profession,
        education: formData.education,
      });

      if (res.success) {
        toast({
          title: "Profile Updated",
          description: "Your candidate profile information has been saved successfully.",
          variant: "success",
        });
      } else {
        toast({
          title: "Update Failed",
          description: res.error || "Could not save profile changes.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Update Failed",
        description: "An error occurred while saving candidate profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#167A3D]" />
        <p className="text-sm font-semibold text-slate-600">Loading your candidate profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Candidate Profile"
        subtitle="Manage your personal information, contact numbers, and professional trade credentials."
      />

      <Card className="border-[#D7E8D8] bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#167A3D] text-lg font-bold">Personal & Professional Details</CardTitle>
              <CardDescription className="text-xs">
                Verify that all credentials match your official CNIC and Passport.
              </CardDescription>
            </div>
            {formData.email && (
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#167A3D] border border-emerald-200">
                <UserCheck className="h-3.5 w-3.5" />
                <span>{formData.email}</span>
              </div>
            )}
          </div>
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
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fatherName">Father&apos;s Name</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  placeholder="Enter father's name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Registered Email (Logged In Account)</Label>
                <Input id="email" value={formData.email} readOnly className="bg-slate-100 font-medium text-slate-700 cursor-not-allowed" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cnic">CNIC Number</Label>
                <Input
                  id="cnic"
                  value={formData.cnic}
                  onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                  placeholder="12345-1234567-1"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="passportNumber">Passport Number *</Label>
                <Input
                  id="passportNumber"
                  value={formData.noPassport ? "" : formData.passportNumber}
                  onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                  placeholder={formData.noPassport ? "N/A (No Passport)" : "Passport number (e.g. AB1234567)"}
                  disabled={formData.noPassport}
                />
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="noPassport"
                    checked={formData.noPassport}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData({
                        ...formData,
                        noPassport: checked,
                        passportNumber: checked ? "" : formData.passportNumber,
                      });
                    }}
                    className="h-4 w-4 rounded border-[#D7E8D8] text-[#167A3D] focus:ring-[#167A3D]"
                  />
                  <Label htmlFor="noPassport" className="text-xs text-slate-700 font-medium cursor-pointer">
                    I don&apos;t have a passport
                  </Label>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Mobile Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="03001234567"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="03001234567"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Karachi"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="province">Province</Label>
                <Select
                  id="province"
                  value={formData.province || "Sindh"}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                >
                  <option value="Sindh">Sindh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="KPK">KPK</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profession">Trade Profession</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  placeholder="e.g. Electrician / Welder / Driver"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="education">Education / Qualification</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="e.g. DAE / Matric / Intermediate"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold gap-2 rounded-xl mt-4"
            >
              {saving ? "Saving Changes..." : "Save Profile Details"}{" "}
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
