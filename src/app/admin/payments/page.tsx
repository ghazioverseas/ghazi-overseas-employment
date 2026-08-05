"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaymentVerificationService } from "@/services/payment.service";
import { verifyPaymentAction } from "@/actions/admin.actions";
import { VerificationStatus } from "@/types";

interface PaymentRow {
  id: string;
  fullName: string;
  cnic: string;
  transactionRef: string;
  submissionFee: number;
  paymentStatus: VerificationStatus;
  updatedAt: Date | string;
}

export default function AdminPaymentsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRow[]>([]);

  const loadQueue = async () => {
    try {
      const data = await PaymentVerificationService.getPendingPayments();
      setPayments(data as PaymentRow[]);
    } catch {
      // Fallback queue
      setPayments([
        {
          id: "cand_1",
          fullName: "Muhammad Ali",
          cnic: "42101-1234567-1",
          transactionRef: "TRX-99882211",
          submissionFee: 500,
          paymentStatus: "payment_under_review",
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleDecision = async (candidateId: string, decision: "approve" | "reject" | "request_new") => {
    try {
      const res = await verifyPaymentAction({ candidateId, decision });
      if (res.success) {
        toast({
          title: "Payment Verified",
          description: decision === "approve"
            ? "Payment Approved! Candidate status automatically set to Approved."
            : `Payment decision recorded: ${decision.toUpperCase()}`,
          variant: "success",
        });
        setPayments(payments.filter((p) => p.id !== candidateId));
      } else {
        toast({ title: "Error", description: res.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to verify payment.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Verification Queue"
        subtitle="Verify submitted bank transfer receipts and mobile wallet transaction reference IDs (TID)."
      />

      <Card className="border-[#D7E8D8] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-slate-700 font-bold border-b border-[#D7E8D8]">
              <tr>
                <th className="p-4">Candidate Name</th>
                <th className="p-4">CNIC</th>
                <th className="p-4">Transaction Ref / TID</th>
                <th className="p-4">Submission Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E8D8] text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                    Loading pending payments queue...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                    No pending payments in verification queue.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAF8] transition-colors">
                    <td className="p-4 font-bold text-slate-900">{p.fullName}</td>
                    <td className="p-4">{p.cnic}</td>
                    <td className="p-4 font-bold text-[#167A3D]">{p.transactionRef || "N/A"}</td>
                    <td className="p-4 font-bold text-slate-900">Rs. {p.submissionFee}</td>
                    <td className="p-4">
                      <StatusBadge status={p.paymentStatus} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          className="bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold gap-1 rounded-xl"
                          onClick={() => handleDecision(p.id, "approve")}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve Payment
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-50 font-bold gap-1 rounded-xl"
                          onClick={() => handleDecision(p.id, "reject")}
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-300 text-amber-800 hover:bg-amber-50 font-bold gap-1 rounded-xl"
                          onClick={() => handleDecision(p.id, "request_new")}
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Request New
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
