"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { executeApplicationAction } from "@/actions/application.actions";
import { useToast } from "@/hooks/use-toast";

interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  candidateId: string;
  action: "approve" | "reject" | "return_correction" | "request_missing" | "mark_processing" | "mark_completed";
  onSuccess: () => void;
}

export function ApplicationActionModal({ open, onClose, candidateId, action, onSuccess }: ActionModalProps) {
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const actionTitles: Record<string, string> = {
    approve: "Approve Candidate Application",
    reject: "Reject Candidate Application",
    return_correction: "Return Application for Correction",
    request_missing: "Request Missing Documents",
    mark_processing: "Mark Application as Processing",
    mark_completed: "Mark Application as Completed",
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await executeApplicationAction({
        candidateId,
        action,
        reason,
      });

      if (res.success) {
        toast({ title: "Action Executed", description: res.message, variant: "success" });
        onSuccess();
        onClose();
      } else {
        toast({ title: "Error", description: res.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to execute action.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">{actionTitles[action] || "Application Action"}</h3>
        <p className="text-xs text-slate-600">
          This decision will update the candidate status in the live Neon DB and record an entry in the System Audit Log.
        </p>

        <div className="space-y-1.5">
          <Label htmlFor="actionReason">Remarks / Note (Optional)</Label>
          <textarea
            id="actionReason"
            rows={3}
            placeholder="Enter reason or instructions for the candidate..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-[#D7E8D8] p-3 text-xs focus:ring-[#167A3D]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading} className="border-[#D7E8D8]">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={
              action === "reject"
                ? "bg-red-600 hover:bg-red-700 text-white font-bold"
                : "bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold"
            }
          >
            {loading ? "Processing..." : "Confirm Action"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
