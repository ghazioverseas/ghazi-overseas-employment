"use server";

import { paymentProofSchema } from "@/validators/payment.schema";
import { CandidateService } from "@/services/candidate.service";
import { logger } from "@/lib/logger";

export async function submitPaymentProofAction(formData: unknown) {
  try {
    const validated = paymentProofSchema.parse(formData);

    const updatedCandidate = await CandidateService.updatePaymentSubmission(
      validated.candidateId,
      validated.transactionRef,
      validated.paymentProofKey
    );

    logger.info("auth", "Payment proof submitted successfully", {
      candidateId: validated.candidateId,
      transactionRef: validated.transactionRef,
    });

    return {
      success: true,
      message: "Payment proof submitted successfully. Your application status is now Awaiting Payment Verification.",
      data: updatedCandidate,
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to submit payment proof.";
    logger.error("server", "Payment proof submission error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}
