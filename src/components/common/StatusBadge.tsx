import React from "react";
import { Badge } from "@/components/ui/badge";
import { CandidateStatus, VerificationStatus } from "@/types";

interface StatusBadgeProps {
  status: CandidateStatus | VerificationStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "verified":
      return <Badge variant="success">Verified</Badge>;
    case "shortlisted":
      return <Badge variant="default" className="bg-blue-700">Shortlisted</Badge>;
    case "under_review":
    case "pending":
      return <Badge variant="warning">Under Review</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "registered":
      return <Badge variant="secondary">Registered</Badge>;
    case "profile_incomplete":
    case "documents_pending":
      return <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">Pending Info</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
