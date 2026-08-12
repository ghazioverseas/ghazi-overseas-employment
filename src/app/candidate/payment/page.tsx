"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CreditCard, CheckCircle2, Building2, Smartphone, Copy, Check, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitPaymentProofAction } from "@/actions/payment.actions";
import { getAdminSettingsAction } from "@/actions/settings.actions";
import { getCurrentCandidateProfileAction } from "@/actions/candidate.actions";

export default function CandidatePaymentPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [candidateId, setCandidateId] = useState<string>("current");
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "easypaisa" | "jazzcash">("bank_transfer");
  const [paymentStatus, setPaymentStatus] = useState<"pending_payment" | "payment_under_review" | "approved" | "rejected">("pending_payment");
  const [submissionFee, setSubmissionFee] = useState(500);

  // Bank & Mobile Wallet account details
  const [bankDetails, setBankDetails] = useState({
    bankName: "Meezan Bank Limited",
    accountTitle: "Ghazi Overseas Employment",
    accountNumber: "0102030405060708",
    iban: "PK36MEZN0001020304050607",
    easypaisaTitle: "Ghazi Overseas Employment",
    easypaisaNumber: "03001234567",
    jazzcashTitle: "Ghazi Overseas Employment",
    jazzcashNumber: "03011234567",
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast({ title: "Copied!", description: `${fieldName} copied to clipboard.`, variant: "success" });
    setTimeout(() => setCopiedField(null), 2000);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, profileRes] = await Promise.all([
          getAdminSettingsAction(),
          getCurrentCandidateProfileAction(),
        ]);

        if (settingsRes.success && settingsRes.data) {
          const data = settingsRes.data as {
            submissionFee?: number;
            bankName?: string;
            accountTitle?: string;
            accountNumber?: string;
            iban?: string;
            easypaisaTitle?: string;
            easypaisaNumber?: string;
            jazzcashTitle?: string;
            jazzcashNumber?: string;
          };
          setSubmissionFee(data.submissionFee || 500);
          setBankDetails({
            bankName: data.bankName || "Meezan Bank Limited",
            accountTitle: data.accountTitle || "Ghazi Overseas Employment",
            accountNumber: data.accountNumber || "0102030405060708",
            iban: data.iban || "PK36MEZN0001020304050607",
            easypaisaTitle: data.easypaisaTitle || "Ghazi Overseas Employment",
            easypaisaNumber: data.easypaisaNumber || "03001234567",
            jazzcashTitle: data.jazzcashTitle || "Ghazi Overseas Employment",
            jazzcashNumber: data.jazzcashNumber || "03011234567",
          });
        }

        if (profileRes.success && profileRes.data) {
          setCandidateId(profileRes.data.id);
          const rawStatus = (profileRes.data.paymentStatus as "pending_payment" | "payment_under_review" | "approved" | "rejected") || "pending_payment";
          setPaymentStatus(rawStatus);
          if (profileRes.data.transactionRef) {
            setTransactionRef(profileRes.data.transactionRef);
          }
        }
      } catch {
        // Fallback defaults
      }
    }
    loadData();
  }, []);

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      toast({ title: "Validation Error", description: "Please enter your transaction reference / TID number.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await submitPaymentProofAction({
        candidateId,
        transactionRef: transactionRef.trim(),
        paymentMethod,
      });

      if (res.success) {
        setPaymentStatus("payment_under_review");
        toast({
          title: "Payment Submitted Successfully",
          description: "Transaction reference submitted. Status is now Payment Under Review.",
          variant: "success",
        });
      } else {
        toast({ title: "Submission Failed", description: res.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to submit transaction reference.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Registration & Fee Payment"
        subtitle="Complete your candidate registration by paying the processing fee via Bank Transfer, EasyPaisa, or JazzCash."
      />

      {/* Payment Notice Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 shadow-sm">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900 text-sm">Registration Payment Required *</p>
            <p className="text-amber-800 text-xs mt-0.5">
              Candidate registration & document verification will remain pending until your processing fee payment of <strong>Rs. {submissionFee}</strong> is submitted.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={paymentStatus} />
        </div>
      </div>

      {/* Payment Channel Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#167A3D]" /> Official Payment Deposit Channels
        </h2>
        <p className="text-xs text-slate-500">
          Please transfer <strong>Rs. {submissionFee}</strong> using any one of the official channels below, then enter your transaction reference / TID number below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1: Bank Transfer (Meezan Bank - Purple Theme) */}
          <Card className="border-[#4A144E]/30 bg-[#FAF7FB] shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
            <div className="bg-[#4A144E] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-extrabold">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/payments/meezan-bank-logo.png" alt="Meezan Bank" className="h-11 w-11 object-contain rounded-full bg-white p-1 shadow-md shrink-0" />
                <div>
                  <span className="block text-xs font-extrabold">Bank Account Transfer</span>
                  <span className="text-[10px] text-purple-200 font-normal">Meezan Bank Limited</span>
                </div>
              </div>
              <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full shrink-0">Recommended</span>
            </div>

            <CardContent className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div>
                  <span className="text-[10px] font-bold text-[#4A144E]/70 uppercase tracking-wider">Bank Name</span>
                  <p className="font-extrabold text-[#4A144E] text-sm">{bankDetails.bankName}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#4A144E]/70 uppercase tracking-wider">Account Title</span>
                  <p className="font-bold text-slate-900">{bankDetails.accountTitle}</p>
                </div>

                <div className="rounded-xl bg-[#F4ECF5] p-3 border border-[#D8C2DA] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-600 font-bold">Account Number:</span>
                      <p className="font-black text-[#4A144E] tracking-wider text-xs">{bankDetails.accountNumber}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2.5 text-[10px] gap-1 text-[#4A144E] hover:bg-[#EADCEB] font-bold"
                      onClick={() => copyToClipboard(bankDetails.accountNumber, "Account Number")}
                    >
                      {copiedField === "Account Number" ? <Check className="h-3.5 w-3.5 text-[#4A144E]" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedField === "Account Number" ? "Copied" : "Copy"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#D8C2DA] pt-2">
                    <div>
                      <span className="text-[10px] text-slate-600 font-bold">IBAN Number:</span>
                      <p className="font-black text-[#4A144E] tracking-wider text-[11px] truncate max-w-[140px]">{bankDetails.iban}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2.5 text-[10px] gap-1 text-[#4A144E] hover:bg-[#EADCEB] font-bold"
                      onClick={() => copyToClipboard(bankDetails.iban, "IBAN")}
                    >
                      {copiedField === "IBAN" ? <Check className="h-3.5 w-3.5 text-[#4A144E]" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedField === "IBAN" ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-purple-900/70 italic mt-2 font-medium">
                Transfer via 1Link, ATM, Mobile Banking App, or Counter Deposit.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: EasyPaisa (Green Theme) */}
          <Card className="border-[#00A859]/30 bg-[#F2FBF6] shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
            <div className="bg-[#00A859] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-extrabold">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/payments/easypaisa-logo.png" alt="EasyPaisa" className="h-10 w-auto max-w-[90px] object-contain rounded-lg bg-white p-1 shadow-md shrink-0" />
                <div>
                  <span className="block text-xs font-extrabold">EasyPaisa Mobile Wallet</span>
                  <span className="text-[10px] text-emerald-100 font-normal">Instant Transfer</span>
                </div>
              </div>
              <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full shrink-0">Instant</span>
            </div>

            <CardContent className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div>
                  <span className="text-[10px] font-bold text-[#00A859]/80 uppercase tracking-wider">Account Title</span>
                  <p className="font-extrabold text-[#006B38] text-sm">{bankDetails.easypaisaTitle}</p>
                </div>

                <div className="rounded-xl bg-[#E6F7ED] p-3 border border-[#A2E3BF] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-700 font-bold">EasyPaisa Account Number:</span>
                    <p className="font-black text-[#006B38] tracking-wider text-base">{bankDetails.easypaisaNumber}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2.5 text-[10px] gap-1 text-[#006B38] hover:bg-[#C9F0DB] font-bold"
                    onClick={() => copyToClipboard(bankDetails.easypaisaNumber, "EasyPaisa Number")}
                  >
                    {copiedField === "EasyPaisa Number" ? <Check className="h-3.5 w-3.5 text-[#006B38]" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedField === "EasyPaisa Number" ? "Copied" : "Copy"}
                  </Button>
                </div>

                <div className="rounded-lg bg-[#D8F3E5] p-2.5 border border-[#A2E3BF] space-y-1 text-[11px] text-slate-800">
                  <p className="font-bold text-[#006B38]">How to pay via EasyPaisa:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[10px] text-slate-700">
                    <li>Open EasyPaisa App & Select <strong>Send Money</strong></li>
                    <li>Choose <strong>EasyPaisa Account</strong></li>
                    <li>Enter <strong>{bankDetails.easypaisaNumber}</strong> & Amount <strong>Rs. {submissionFee}</strong></li>
                    <li>Copy Transaction ID (TID) from receipt SMS</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: JazzCash (Red & Yellow Theme) */}
          <Card className="border-[#E31B23]/30 bg-[#FFFDF5] shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
            <div className="bg-gradient-to-r from-[#E31B23] via-[#D1171E] to-[#E31B23] text-white p-3.5 flex items-center justify-between border-b-4 border-[#FFC20E]">
              <div className="flex items-center gap-3 text-xs font-extrabold">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/payments/jazzcash-logo.png" alt="JazzCash" className="h-10 w-auto max-w-[90px] object-contain rounded-lg bg-white p-1 shadow-md shrink-0" />
                <div>
                  <span className="block text-xs font-extrabold">JazzCash Mobile Wallet</span>
                  <span className="text-[10px] text-yellow-200 font-normal">Instant Transfer</span>
                </div>
              </div>
              <span className="text-[10px] bg-[#FFC20E] text-slate-950 font-black px-2.5 py-0.5 rounded-full shrink-0 shadow-sm">Instant</span>
            </div>

            <CardContent className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div>
                  <span className="text-[10px] font-bold text-[#E31B23]/80 uppercase tracking-wider">Account Title</span>
                  <p className="font-extrabold text-[#B91C1C] text-sm">{bankDetails.jazzcashTitle}</p>
                </div>

                <div className="rounded-xl bg-[#FFF7D6] p-3 border border-[#FCD34D] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-800 font-bold">JazzCash Account Number:</span>
                    <p className="font-black text-[#B91C1C] tracking-wider text-base">{bankDetails.jazzcashNumber}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2.5 text-[10px] gap-1 text-[#B91C1C] hover:bg-[#FEF08A] font-bold"
                    onClick={() => copyToClipboard(bankDetails.jazzcashNumber, "JazzCash Number")}
                  >
                    {copiedField === "JazzCash Number" ? <Check className="h-3.5 w-3.5 text-[#B91C1C]" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedField === "JazzCash Number" ? "Copied" : "Copy"}
                  </Button>
                </div>

                <div className="rounded-lg bg-[#FEF3C7] p-2.5 border border-[#FDE68A] space-y-1 text-[11px] text-slate-800">
                  <p className="font-bold text-[#B91C1C]">How to pay via JazzCash:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[10px] text-slate-700">
                    <li>Open JazzCash App or Dial <strong>*786#</strong></li>
                    <li>Select <strong>Money Transfer</strong> ➔ <strong>JazzCash Account</strong></li>
                    <li>Enter <strong>{bankDetails.jazzcashNumber}</strong> & Amount <strong>Rs. {submissionFee}</strong></li>
                    <li>Copy Transaction ID (TID) from confirmation SMS</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submission Form Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pt-4">
        <Card className="border-[#D7E8D8] bg-white shadow-sm md:col-span-1">
          <CardHeader>
            <CardTitle className="text-[#167A3D] text-base font-bold">Verification Summary</CardTitle>
            <CardDescription className="text-xs">Required fee status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-[#F8FAF8] p-4 border border-[#D7E8D8] text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-600 font-semibold">Application Fee:</span>
                <span className="font-black text-slate-900 text-sm">Rs. {submissionFee}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-600 font-semibold">Registration Status:</span>
                <span className="font-bold text-amber-700">Pending Verification</span>
              </div>
              <p className="text-[11px] text-slate-600 pt-1">
                {paymentStatus === "payment_under_review" && "Your transaction reference has been submitted and is currently being verified by Ghazi Overseas clearance team."}
                {paymentStatus === "approved" && "Payment Verified! Your candidate registration has been finalized."}
                {paymentStatus === "pending_payment" && "Please submit your transaction reference ID to complete candidate registration."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D7E8D8] bg-white shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-900 text-base font-bold">Submit Payment Transaction Reference</CardTitle>
            <CardDescription className="text-xs">
              Enter the transaction reference number / TID provided on your payment receipt to complete registration.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {paymentStatus === "payment_under_review" ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-amber-50 p-8 text-center border border-amber-200 space-y-2">
                <CheckCircle2 className="h-10 w-10 text-amber-600 mb-1" />
                <h3 className="text-base font-bold text-slate-900">Payment Reference Under Review</h3>
                <p className="text-xs text-slate-600 max-w-md">
                  Transaction Reference <strong>{transactionRef || "TRX-SUBMITTED"}</strong> has been received. Ghazi Overseas Admin is verifying your payment to finalize registration.
                </p>
              </div>
            ) : paymentStatus === "approved" ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-emerald-50 p-8 text-center border border-emerald-200 space-y-2">
                <CheckCircle2 className="h-10 w-10 text-[#167A3D] mb-1" />
                <h3 className="text-base font-bold text-slate-900">Payment Verified ✓</h3>
                <p className="text-xs text-slate-600 max-w-md">
                  Your payment has been verified by Ghazi Overseas team. Candidate registration is complete and active!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProof} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="paymentMethod" className="font-bold">Payment Method Used *</Label>
                  <Select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setPaymentMethod(e.target.value as "bank_transfer" | "easypaisa" | "jazzcash")
                    }
                  >
                    <option value="bank_transfer">Bank Account Transfer ({bankDetails.bankName})</option>
                    <option value="easypaisa">EasyPaisa Mobile Wallet ({bankDetails.easypaisaNumber})</option>
                    <option value="jazzcash">JazzCash Mobile Wallet ({bankDetails.jazzcashNumber})</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="transactionRef" className="font-bold">Transaction Reference ID / TID Number *</Label>
                  <Input
                    id="transactionRef"
                    placeholder="e.g. 1029384756 or TRX-998822"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-[10px] text-slate-500">
                    Enter the TID or transaction reference number from your bank transfer receipt or mobile wallet SMS.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-extrabold gap-2 rounded-xl text-sm shadow-md"
                >
                  {loading ? "Submitting Payment Reference..." : "Submit Payment Reference to Finalize Registration"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
