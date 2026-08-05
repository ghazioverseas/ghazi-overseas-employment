import { db } from "@/lib/db";
import { candidates } from "@/db/schema/candidates";
import { documents } from "@/db/schema/documents";
import { applicationNotes } from "@/db/schema/notes";
import { eq, desc } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { LogService } from "@/services/log.service";
import { CandidateStatus, VerificationStatus } from "@/types";

export class ApplicationService {
  static async getApplicationDetails(candidateId: string) {
    try {
      const candidateList = await db.select().from(candidates).where(eq(candidates.id, candidateId)).limit(1);
      if (candidateList.length === 0) return null;

      const candidate = candidateList[0];
      const docList = await db.select().from(documents).where(eq(documents.candidateId, candidateId));
      const notesList = await db
        .select()
        .from(applicationNotes)
        .where(eq(applicationNotes.candidateId, candidateId))
        .orderBy(desc(applicationNotes.createdAt));

      return {
        candidate,
        documents: docList,
        notes: notesList,
      };
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Database error";
      logger.error("database", "Failed to fetch application details", { candidateId, error: errMessage });
      return null;
    }
  }

  static async executeApplicationAction(data: {
    candidateId: string;
    action: "approve" | "reject" | "return_correction" | "request_missing" | "mark_processing" | "mark_completed";
    reason?: string;
    adminUserId: string;
    adminName: string;
  }) {
    try {
      let newStatus: CandidateStatus = "registered";
      let newPaymentStatus: VerificationStatus | undefined = undefined;
      let logActionName = "APPLICATION_ACTION";

      switch (data.action) {
        case "approve":
          newStatus = "approved";
          newPaymentStatus = "approved";
          logActionName = "APPLICATION_APPROVED";
          break;
        case "reject":
          newStatus = "rejected";
          newPaymentStatus = "rejected";
          logActionName = "APPLICATION_REJECTED";
          break;
        case "return_correction":
          newStatus = "profile_incomplete";
          logActionName = "APPLICATION_RETURNED_FOR_CORRECTION";
          break;
        case "request_missing":
          newStatus = "documents_pending";
          logActionName = "APPLICATION_REQUEST_MISSING_DOCUMENTS";
          break;
        case "mark_processing":
          newStatus = "under_review";
          logActionName = "APPLICATION_MARKED_PROCESSING";
          break;
        case "mark_completed":
          newStatus = "verified";
          logActionName = "APPLICATION_MARKED_COMPLETED";
          break;
      }

      const updatePayload: Record<string, unknown> = {
        status: newStatus,
        updatedAt: new Date(),
      };
      if (newPaymentStatus) {
        updatePayload.paymentStatus = newPaymentStatus;
      }

      const updated = await db
        .update(candidates)
        .set(updatePayload)
        .where(eq(candidates.id, data.candidateId))
        .returning();

      // Log internal note if reason provided
      if (data.reason && data.reason.trim()) {
        await db.insert(applicationNotes).values({
          id: crypto.randomUUID(),
          candidateId: data.candidateId,
          adminId: data.adminUserId,
          adminName: data.adminName,
          note: `[Action: ${data.action.toUpperCase()}] ${data.reason}`,
        });
      }

      // Create System Log safely via LogService
      await LogService.recordLog(
        "info",
        "server",
        `${logActionName}: Candidate ${data.candidateId}`,
        { candidateId: data.candidateId, action: data.action, reason: data.reason },
        data.adminUserId
      );

      logger.info("server", `Admin executed application action: ${data.action}`, {
        candidateId: data.candidateId,
        adminId: data.adminUserId,
      });

      return updated[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Database error";
      logger.error("database", "Failed to execute application action", { data, error: errMessage });
      throw new Error(`Failed to update application state: ${errMessage}`);
    }
  }

  static async addApplicationNote(candidateId: string, adminId: string, adminName: string, note: string) {
    try {
      const inserted = await db
        .insert(applicationNotes)
        .values({
          id: crypto.randomUUID(),
          candidateId,
          adminId,
          adminName,
          note,
        })
        .returning();
      return inserted[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Database error";
      logger.error("database", "Failed to add application note", { candidateId, error: errMessage });
      throw new Error(`Failed to insert note: ${errMessage}`);
    }
  }
}
