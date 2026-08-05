"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitPaymentProofAction } from "@/actions/payment.actions";
import { getAdminSettingsAction } from "@/actions/settings.actions";

export default function CandidatePaymentPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "easypaisa" | "jazzcash">("bank_transfer");
  const [paymentStatus, setPaymentStatus] = useState<"pending_payment" | "payment_under_review" | "approved" | "rejected">("pending_payment");
  const [submissionFee, setSubmissionFee] = useState(500);

  useEffect(() => {
    async function loadFee() {
      try {
        const res = await getAdminSettingsAction();
        if (res.success && res.data) {
          setSubmissionFee((res.data as { submissionFee?: number }).submissionFee || 500);
        }
      } catch {
        // Fallback
      }
    }
    loadFee();
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
        candidateId: "demo_candidate_id",
        transactionRef,
        paymentMethod,
      });

      if (res.success) {
        setPaymentStatus("payment_under_review");
        toast({
          title: "Payment Submitted",
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
        title="Application Fee Payment Verification"
        subtitle="Submit your bank transaction reference ID or EasyPaisa / JazzCash TID for admin verification."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-[#D7E8D8] bg-white shadow-sm md:col-span-1">
          <CardHeader>
            <CardTitle className="text-[#167A3D] text-lg font-bold">Payment Status</CardTitle>
            <CardDescription className="text-xs">Current verification state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-500">Status Badge:</span>
              <StatusBadge status={paymentStatus} />
            </div>

            <div className="rounded-xl bg-[#F8FAF8] p-4 border border-[#D7E8D8] text-xs space-y-2">
              <p className="font-bold text-slate-900">Mandatory Submission Fee:</p>
              <p className="text-xl font-black text-[#167A3D]">Rs. {submissionFee}</p>
              <p className="text-slate-500 pt-1">
                {paymentStatus === "payment_under_review" && "Your transaction is undergoing admin verification."}
                {paymentStatus === "approved" && "Payment Verified! Your application has been approved."}
                {paymentStatus === "pending_payment" && "Please submit your transaction reference below."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D7E8D8] bg-white shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-900 text-lg font-bold">Submit Payment Reference</CardTitle>
            <CardDescription className="text-xs">
              Enter the transaction reference number provided by your bank or mobile wallet app.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {paymentStatus === "payment_under_review" ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-amber-50 p-8 text-center border border-amber-200">
                <CheckCircle2 className="h-10 w-10 text-amber-600 mb-3" />
                <h3 className="text-base font-bold text-slate-900">Payment Proof Under Review</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md">
                  Transaction Reference <strong>{transactionRef || "TRX-89123"}</strong> has been submitted. Ghazi Overseas Admin is verifying your payment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProof} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="paymentMethod">Payment Method Used *</Label>
                  <Select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setPaymentMethod(e.target.value as "bank_transfer" | "easypaisa" | "jazzcash")
                    }
                  >
                    <option value="bank_transfer">Bank Account Transfer (Meezan Bank)</option>
                    <option value="easypaisa">EasyPaisa Mobile Account</option>
                    <option value="jazzcash">JazzCash Mobile Account</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="transactionRef">Transaction Reference ID / TID Number *</Label>
                  <Input
                    id="transactionRef"
                    placeholder="e.g. 1029384756 or TRX-998822"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-500">
                    Located on your transfer receipt or SMS notification from bank/wallet.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#167A3D] hover:bg-[#0E5D2E] text-[#ffffff] font-extrabold gap-2 rounded-xl"
                >
                  {loading ? "Submitting Proof..." : "Submit Payment Reference for Verification"} <CreditCard className="h-4 w-4" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
