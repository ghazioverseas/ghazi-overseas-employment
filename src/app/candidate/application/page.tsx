"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Building2, CreditCard, AlertCircle, ArrowRight } from "lucide-react";
import { getAdminSettingsAction } from "@/actions/settings.actions";

interface PaymentSettings {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  showBank: boolean;
  easypaisaNumber: string;
  easypaisaTitle: string;
  showEasypaisa: boolean;
  jazzcashNumber: string;
  jazzcashTitle: string;
  showJazzcash: boolean;
  submissionFee: number;
  isSubmissionFeeEnabled: boolean;
}

export default function CandidateApplicationPage() {
  const [submitted] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    bankName: "Meezan Bank Limited",
    accountTitle: "Ghazi Overseas Employment Pakistan",
    accountNumber: "0102030405060708",
    iban: "PK36MEZN0001020304050607",
    showBank: true,
    easypaisaNumber: "03001234567",
    easypaisaTitle: "Ghazi Overseas Employment",
    showEasypaisa: true,
    jazzcashNumber: "03011234567",
    jazzcashTitle: "Ghazi Overseas Employment",
    showJazzcash: true,
    submissionFee: 500,
    isSubmissionFeeEnabled: true,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await getAdminSettingsAction();
        if (res.success && res.data) {
          setPaymentSettings(res.data as PaymentSettings);
        }
      } catch {
        // Fallback
      }
    }
    loadSettings();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Candidate Application"
        subtitle="Review your registered candidate profile, document checklist, and submission payment instructions."
      />

      <Card className="border-[#D7E8D8] bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#D7E8D8]">
          <div>
            <CardTitle className="text-xl font-extrabold text-slate-900">Application File Summary</CardTitle>
            <CardDescription className="text-xs mt-1">Ref ID: GHAZI-APP-2026-8912</CardDescription>
          </div>
          <StatusBadge status={submitted ? "awaiting_payment_verification" : "registered"} />
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Profile Summary */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#167A3D] mb-3">
              1. Candidate Profile Data
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-xl bg-[#F8FAF8] p-4 border border-[#D7E8D8] text-xs">
              <div>
                <span className="text-slate-500 font-medium">Full Name:</span>
                <p className="font-bold text-slate-900 mt-0.5">Muhammad Ali</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">CNIC Number:</span>
                <p className="font-bold text-slate-900 mt-0.5">42101-1234567-1</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Phone & WhatsApp:</span>
                <p className="font-bold text-slate-900 mt-0.5">03001234567</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Profession / Trade:</span>
                <p className="font-bold text-slate-900 mt-0.5">Electrician Specialist</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">City & Province:</span>
                <p className="font-bold text-slate-900 mt-0.5">Karachi, Sindh</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Experience:</span>
                <p className="font-bold text-slate-900 mt-0.5">5 Years</p>
              </div>
            </div>
          </div>

          {/* Dynamic Payment Verification Instructions */}
          {paymentSettings.isSubmissionFeeEnabled && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#167A3D] mb-3 flex items-center justify-between">
                <span>2. Required Submission Fee: Rs. {paymentSettings.submissionFee}</span>
                <span className="text-xs text-slate-500 normal-case font-normal">(Manual Bank / Mobile Transfer)</span>
              </h3>

              <div className="rounded-2xl border border-[#D7E8D8] bg-[#F8FAF8] p-6 space-y-6">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-[#D7E8D8]">
                  <AlertCircle className="h-5 w-5 text-[#167A3D] shrink-0" />
                  <span>
                    Please transfer the mandatory application submission fee of <strong>Rs. {paymentSettings.submissionFee}</strong> using any of the active official Ghazi Overseas accounts below, then submit your Transaction Reference ID.
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 text-xs">
                  {paymentSettings.showBank && (
                    <div className="rounded-xl bg-white p-4 border border-[#D7E8D8] shadow-sm space-y-2">
                      <div className="flex items-center gap-2 font-bold text-[#167A3D]">
                        <Building2 className="h-4 w-4" /> Bank Account Transfer
                      </div>
                      <div className="space-y-1 text-slate-700 pt-1">
                        <p><span className="font-bold">Bank:</span> {paymentSettings.bankName}</p>
                        <p><span className="font-bold">Title:</span> {paymentSettings.accountTitle}</p>
                        <p><span className="font-bold">Account #:</span> {paymentSettings.accountNumber}</p>
                        <p><span className="font-bold">IBAN:</span> {paymentSettings.iban}</p>
                      </div>
                    </div>
                  )}

                  {paymentSettings.showEasypaisa && (
                    <div className="rounded-xl bg-white p-4 border border-[#D7E8D8] shadow-sm space-y-2">
                      <div className="flex items-center gap-2 font-bold text-[#167A3D]">
                        <CreditCard className="h-4 w-4" /> EasyPaisa Mobile Wallet
                      </div>
                      <div className="space-y-1 text-slate-700 pt-1">
                        <p><span className="font-bold">Account Title:</span> {paymentSettings.easypaisaTitle}</p>
                        <p><span className="font-bold">Mobile #:</span> {paymentSettings.easypaisaNumber}</p>
                      </div>
                    </div>
                  )}

                  {paymentSettings.showJazzcash && (
                    <div className="rounded-xl bg-white p-4 border border-[#D7E8D8] shadow-sm space-y-2">
                      <div className="flex items-center gap-2 font-bold text-[#167A3D]">
                        <CreditCard className="h-4 w-4" /> JazzCash Mobile Wallet
                      </div>
                      <div className="space-y-1 text-slate-700 pt-1">
                        <p><span className="font-bold">Account Title:</span> {paymentSettings.jazzcashTitle}</p>
                        <p><span className="font-bold">Mobile #:</span> {paymentSettings.jazzcashNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-[#D7E8D8] p-6 bg-[#F8FAF8]">
          <div className="text-xs text-slate-600 mb-4 sm:mb-0">
            Clicking submit sets status to <strong>Awaiting Payment Verification</strong> for Admin approval.
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Link href="/candidate/payment" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-extrabold gap-2 rounded-xl">
                Submit Transaction Reference <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
