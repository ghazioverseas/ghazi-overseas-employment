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

import { getCurrentCandidateProfileAction } from "@/actions/candidate.actions";
import { getApplicationDetailsAction } from "@/actions/admin.actions";
import { CandidateStatus, VerificationStatus } from "@/types";

interface CandidateProfileData {
  id: string;
  fullName: string;
  cnic: string;
  phone: string;
  whatsapp?: string;
  profession?: string;
  city?: string;
  province?: string;
  yearsOfExperience?: number;
  status: CandidateStatus;
  paymentStatus: VerificationStatus;
  transactionRef?: string;
}

interface NoteRecord {
  id: string;
  adminName: string;
  note: string;
  createdAt: Date | string;
}

export default function CandidateApplicationPage() {
  const [candidate, setCandidate] = useState<CandidateProfileData | null>(null);
  const [adminNotes, setAdminNotes] = useState<NoteRecord[]>([]);
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
    async function loadData() {
      try {
        const [settingsRes, profileRes] = await Promise.all([
          getAdminSettingsAction(),
          getCurrentCandidateProfileAction(),
        ]);

        if (settingsRes.success && settingsRes.data) {
          setPaymentSettings(settingsRes.data as PaymentSettings);
        }

        if (profileRes.success && profileRes.data) {
          const candData = profileRes.data as CandidateProfileData;
          setCandidate(candData);

          const appDetailsRes = await getApplicationDetailsAction(candData.id);
          if (appDetailsRes.success && appDetailsRes.data) {
            const details = appDetailsRes.data as { notes?: NoteRecord[] };
            if (details.notes) {
              setAdminNotes(details.notes);
            }
          }
        }
      } catch {
        // Fallback
      }
    }
    loadData();
  }, []);

  const latestAdminNote = adminNotes.length > 0 ? adminNotes[0] : null;
  const isReturnedForCorrection = candidate?.status === "profile_incomplete";
  const isMissingDocsRequested = candidate?.status === "documents_pending";
  const isRejected = candidate?.status === "rejected";

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Candidate Application"
        subtitle="Review your registered candidate profile, document checklist, and submission payment instructions."
      />

      {(isReturnedForCorrection || isMissingDocsRequested || isRejected) && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
          isRejected ? "bg-red-50 border-red-200 text-red-900" : "bg-amber-50 border-amber-300 text-amber-900"
        }`}>
          <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-extrabold text-sm">
              {isReturnedForCorrection && "Application Returned for Correction"}
              {isMissingDocsRequested && "Additional / Missing Documents Requested"}
              {isRejected && "Application Rejected by Administration"}
            </h4>
            <p className="font-medium">
              {latestAdminNote
                ? `Admin Remarks: "${latestAdminNote.note}"`
                : "Admin has reviewed your file and requested updates. Please review your profile data and re-upload required documents."}
            </p>
            <div className="pt-2 flex gap-2">
              <Link href="/candidate/documents">
                <Button size="sm" className="bg-[#167A3D] text-white font-bold h-8 text-xs">
                  Go to Upload Documents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Card className="border-[#D7E8D8] bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#D7E8D8]">
          <div>
            <CardTitle className="text-xl font-extrabold text-slate-900">Application File Summary</CardTitle>
            <CardDescription className="text-xs mt-1">Ref ID: GHAZI-APP-{(candidate?.id || "2026").substring(0, 10).toUpperCase()}</CardDescription>
          </div>
          <StatusBadge status={candidate?.status || "registered"} />
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
                <p className="font-bold text-slate-900 mt-0.5">{candidate?.fullName || "Registered Candidate"}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">CNIC Number:</span>
                <p className="font-bold text-slate-900 mt-0.5">{candidate?.cnic || "N/A"}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Phone & WhatsApp:</span>
                <p className="font-bold text-slate-900 mt-0.5">{candidate?.phone || "N/A"}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Profession / Trade:</span>
                <p className="font-bold text-slate-900 mt-0.5">{candidate?.profession || "General Trades"}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">City & Province:</span>
                <p className="font-bold text-slate-900 mt-0.5">{candidate?.city || "Karachi"}, {candidate?.province || "Sindh"}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Experience:</span>
                <p className="font-bold text-slate-900 mt-0.5">{candidate?.yearsOfExperience || 0} Years</p>
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
