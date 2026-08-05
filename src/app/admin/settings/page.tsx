"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsService } from "@/services/settings.service";
import { updateAdminSettingsAction } from "@/actions/settings.actions";
import { Save, Building2, CreditCard, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsRecord {
  companyName?: string;
  companyWebsite?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  isSubmissionFeeEnabled?: boolean;
  showBank?: boolean;
  showEasypaisa?: boolean;
  showJazzcash?: boolean;
  autoDeleteDays?: number;
  maxUploadSizeMb?: number;
  [key: string]: unknown;
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "Ghazi Overseas Employment Pakistan",
    companyWebsite: "https://ghazioverseas.pk",
    companyAddress: "Karachi / Islamabad Commercial Zone, Pakistan",
    companyPhone: "+92 (021) 111-GHAZI-0",
    companyEmail: "info@ghazioverseas.pk",
    submissionFee: 500,
    isSubmissionFeeEnabled: true,
    bankName: "Meezan Bank Limited",
    accountTitle: "Ghazi Overseas Employment Pakistan",
    accountNumber: "0102030405060708",
    iban: "PK36MEZN0001020304050607",
    showBank: true,
    easypaisaTitle: "Ghazi Overseas Employment",
    easypaisaNumber: "03001234567",
    showEasypaisa: true,
    jazzcashTitle: "Ghazi Overseas Employment",
    jazzcashNumber: "03011234567",
    showJazzcash: true,
    autoDeleteDays: 30,
    maxUploadSizeMb: 10,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const s = (await SettingsService.getPaymentSettings()) as SettingsRecord;
        if (s) {
          setFormData((prev) => ({
            ...prev,
            ...s,
            companyName: s.companyName || prev.companyName,
            companyWebsite: s.companyWebsite || prev.companyWebsite,
            companyAddress: s.companyAddress || prev.companyAddress,
            companyPhone: s.companyPhone || prev.companyPhone,
            companyEmail: s.companyEmail || prev.companyEmail,
            isSubmissionFeeEnabled: s.isSubmissionFeeEnabled ?? prev.isSubmissionFeeEnabled,
            showBank: s.showBank ?? prev.showBank,
            showEasypaisa: s.showEasypaisa ?? prev.showEasypaisa,
            showJazzcash: s.showJazzcash ?? prev.showJazzcash,
            autoDeleteDays: s.autoDeleteDays ?? prev.autoDeleteDays,
            maxUploadSizeMb: s.maxUploadSizeMb ?? prev.maxUploadSizeMb,
          }));
        }
      } catch {
        // Fallback defaults
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateAdminSettingsAction(formData);
      if (res.success) {
        toast({
          title: "Settings Saved",
          description: "Admin payment, general, and document settings updated instantly.",
          variant: "success",
        });
      } else {
        toast({ title: "Update Failed", description: res.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update settings.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Portal Settings & Feature Controls"
        subtitle="Manage company information, payment methods, submission fee toggles, auto-delete, and upload limits."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General Company Settings */}
        <Card className="border-[#D7E8D8] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 text-base font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#167A3D]" /> 1. General Company & Agency Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="companyWebsite">Official Website URL *</Label>
                <Input
                  id="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="companyPhone">Official Phone Number *</Label>
                <Input
                  id="companyPhone"
                  value={formData.companyPhone}
                  onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="companyEmail">Official Support Email *</Label>
                <Input
                  id="companyEmail"
                  value={formData.companyEmail}
                  onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="companyAddress">Official Head Office Address *</Label>
                <Input
                  id="companyAddress"
                  value={formData.companyAddress}
                  onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                />
              </div>
            </div>

            {/* Submission Fee Toggle */}
            <div className="rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] p-4 flex items-center justify-between mt-2">
              <div>
                <Label htmlFor="isSubmissionFeeEnabled" className="font-bold text-slate-900 text-sm">
                  Enable Mandatory Application Submission Fee
                </Label>
                <p className="text-xs text-slate-500">
                  If disabled, candidates can submit their applications without submitting payment proof.
                </p>
              </div>
              <input
                type="checkbox"
                id="isSubmissionFeeEnabled"
                checked={formData.isSubmissionFeeEnabled}
                onChange={(e) => setFormData({ ...formData, isSubmissionFeeEnabled: e.target.checked })}
                className="h-5 w-5 rounded border-[#D7E8D8] text-[#167A3D]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="submissionFee">Submission Fee Amount (PKR)</Label>
              <Input
                id="submissionFee"
                type="number"
                value={formData.submissionFee}
                onChange={(e) => setFormData({ ...formData, submissionFee: Number(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Payment Method Settings & Show/Hide Toggles */}
        <Card className="border-[#D7E8D8] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 text-base font-bold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#167A3D]" /> 2. Payment Methods & Candidate Visibility
            </CardTitle>
            <CardDescription className="text-xs">
              Toggling payment methods here updates the Candidate Application Portal in real time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bank Transfer */}
            <div className="rounded-xl border border-[#D7E8D8] p-4 space-y-3 bg-[#F8FAF8]">
              <div className="flex items-center justify-between border-b border-[#D7E8D8] pb-2">
                <span className="font-bold text-[#167A3D] text-sm">Bank Transfer Settings (Meezan Bank)</span>
                <div className="flex items-center gap-2">
                  <Label htmlFor="showBank" className="text-xs font-bold">Show on Candidate Portal</Label>
                  <input
                    type="checkbox"
                    id="showBank"
                    checked={formData.showBank}
                    onChange={(e) => setFormData({ ...formData, showBank: e.target.checked })}
                    className="h-4 w-4 rounded border-[#D7E8D8] text-[#167A3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="accountTitle">Account Title</Label>
                  <Input id="accountTitle" value={formData.accountTitle} onChange={(e) => setFormData({ ...formData, accountTitle: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="iban">IBAN</Label>
                  <Input id="iban" value={formData.iban} onChange={(e) => setFormData({ ...formData, iban: e.target.value })} />
                </div>
              </div>
            </div>

            {/* EasyPaisa */}
            <div className="rounded-xl border border-[#D7E8D8] p-4 space-y-3 bg-[#F8FAF8]">
              <div className="flex items-center justify-between border-b border-[#D7E8D8] pb-2">
                <span className="font-bold text-[#167A3D] text-sm">EasyPaisa Mobile Account</span>
                <div className="flex items-center gap-2">
                  <Label htmlFor="showEasypaisa" className="text-xs font-bold">Show on Candidate Portal</Label>
                  <input
                    type="checkbox"
                    id="showEasypaisa"
                    checked={formData.showEasypaisa}
                    onChange={(e) => setFormData({ ...formData, showEasypaisa: e.target.checked })}
                    className="h-4 w-4 rounded border-[#D7E8D8] text-[#167A3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <Label htmlFor="easypaisaTitle">EasyPaisa Title</Label>
                  <Input id="easypaisaTitle" value={formData.easypaisaTitle} onChange={(e) => setFormData({ ...formData, easypaisaTitle: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="easypaisaNumber">EasyPaisa Number</Label>
                  <Input id="easypaisaNumber" value={formData.easypaisaNumber} onChange={(e) => setFormData({ ...formData, easypaisaNumber: e.target.value })} />
                </div>
              </div>
            </div>

            {/* JazzCash */}
            <div className="rounded-xl border border-[#D7E8D8] p-4 space-y-3 bg-[#F8FAF8]">
              <div className="flex items-center justify-between border-b border-[#D7E8D8] pb-2">
                <span className="font-bold text-[#167A3D] text-sm">JazzCash Mobile Account</span>
                <div className="flex items-center gap-2">
                  <Label htmlFor="showJazzcash" className="text-xs font-bold">Show on Candidate Portal</Label>
                  <input
                    type="checkbox"
                    id="showJazzcash"
                    checked={formData.showJazzcash}
                    onChange={(e) => setFormData({ ...formData, showJazzcash: e.target.checked })}
                    className="h-4 w-4 rounded border-[#D7E8D8] text-[#167A3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <Label htmlFor="jazzcashTitle">JazzCash Title</Label>
                  <Input id="jazzcashTitle" value={formData.jazzcashTitle} onChange={(e) => setFormData({ ...formData, jazzcashTitle: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="jazzcashNumber">JazzCash Number</Label>
                  <Input id="jazzcashNumber" value={formData.jazzcashNumber} onChange={(e) => setFormData({ ...formData, jazzcashNumber: e.target.value })} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Auto-Delete & Cloudflare R2 Upload Limits */}
        <Card className="border-[#D7E8D8] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 text-base font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#167A3D]" /> 3. Auto-Delete Engine & Document Upload Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="autoDeleteDays">Delete Unapproved Applications After (Days) *</Label>
                <Input
                  id="autoDeleteDays"
                  type="number"
                  min="1"
                  value={formData.autoDeleteDays}
                  onChange={(e) => setFormData({ ...formData, autoDeleteDays: Number(e.target.value) })}
                />
                <p className="text-[10px] text-slate-500">Default: 30 days. Purges candidate profile, DB records, and R2 document files.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="maxUploadSizeMb">Maximum Document Upload Limit (MB) *</Label>
                <Input
                  id="maxUploadSizeMb"
                  type="number"
                  min="1"
                  value={formData.maxUploadSizeMb}
                  onChange={(e) => setFormData({ ...formData, maxUploadSizeMb: Number(e.target.value) })}
                />
                <p className="text-[10px] text-slate-500">Default: 10 MB per attachment.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-13 bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-extrabold text-base gap-2 rounded-xl shadow-lg"
        >
          {loading ? "Saving Settings..." : "Save All Admin Settings"} <Save className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
