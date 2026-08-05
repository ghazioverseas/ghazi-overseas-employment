import { db } from "@/lib/db";
import { candidates } from "@/db/schema/candidates";
import { systemLogs } from "@/db/schema/logs";
import { eq, desc } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { CandidateStatus, VerificationStatus } from "@/types";

export class PaymentVerificationService {
  static async getPendingPayments() {
    try {
      return await db
        .select()
        .from(candidates)
        .where(eq(candidates.paymentStatus, "payment_under_review"))
        .orderBy(desc(candidates.updatedAt));
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Database error";
      logger.error("database", "Failed to fetch pending payment queue", { error: errMessage });
      return [];
    }
  }

  static async verifyPayment(data: {
    candidateId: string;
    decision: "approve" | "reject" | "request_new";
    adminUserId: string;
    reason?: string;
  }) {
    try {
      let newPaymentStatus: VerificationStatus = "pending_payment";
      let newStatus: CandidateStatus = "registered";

      if (data.decision === "approve") {
        newPaymentStatus = "approved";
        newStatus = "approved"; // Automatically sets Candidate to Approved!
      } else if (data.decision === "reject") {
        newPaymentStatus = "rejected";
        newStatus = "rejected";
      } else if (data.decision === "request_new") {
        newPaymentStatus = "pending_payment";
        newStatus = "awaiting_payment_verification";
      }

      const updated = await db
        .update(candidates)
        .set({
          paymentStatus: newPaymentStatus,
          status: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(candidates.id, data.candidateId))
        .returning();

      // Log payment decision in system audit log
      await db.insert(systemLogs).values({
        id: crypto.randomUUID(),
        level: "info",
        category: "server",
        message: `PAYMENT_${data.decision.toUpperCase()}: Candidate ${data.candidateId}`,
        metadata: { candidateId: data.candidateId, decision: data.decision, reason: data.reason },
        userId: data.adminUserId,
      });

      logger.info("server", `Payment verified: ${data.decision}`, { candidateId: data.candidateId });
      return updated[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Database error";
      logger.error("database", "Failed to verify payment submission", { data, error: errMessage });
      throw new Error(`Payment verification failed: ${errMessage}`);
    }
  }
}
