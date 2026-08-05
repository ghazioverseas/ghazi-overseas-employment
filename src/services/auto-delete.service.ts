import { db } from "@/lib/db";
import { candidates } from "@/db/schema/candidates";
import { documents } from "@/db/schema/documents";
import { adminSettings } from "@/db/schema/settings";
import { deleteFileFromR2 } from "@/lib/storage/r2";
import { eq, lt, and, ne } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { LogService } from "@/services/log.service";

export class AutoDeleteService {
  static async runAutoDeleteCheck(adminUserId: string = "system_cron") {
    try {
      // 1. Get auto delete threshold days from settings
      const settingsRes = await db.select().from(adminSettings).limit(1);
      const autoDeleteDays = settingsRes[0]?.autoDeleteDays || 30;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - autoDeleteDays);

      // 2. Find expired unapproved candidates (status != 'approved')
      const expiredCandidates = await db
        .select()
        .from(candidates)
        .where(
          and(
            lt(candidates.createdAt, cutoffDate),
            ne(candidates.status, "approved")
          )
        );

      let deletedCount = 0;

      for (const candidate of expiredCandidates) {
        // Fetch candidate documents to purge from R2
        const candidateDocs = await db
          .select()
          .from(documents)
          .where(eq(documents.candidateId, candidate.id));

        for (const doc of candidateDocs) {
          try {
            await deleteFileFromR2(doc.storageKey);
          } catch (r2Error: unknown) {
            const err = r2Error instanceof Error ? r2Error.message : "R2 purge failed";
            logger.error("upload", "Failed to delete R2 file during auto purge", { key: doc.storageKey, error: err });
          }
        }

        // Delete DB records
        await db.delete(documents).where(eq(documents.candidateId, candidate.id));
        await db.delete(candidates).where(eq(candidates.id, candidate.id));

        deletedCount++;

        // Log deletion matching systemLogs schema safely
        await LogService.recordLog(
          "info",
          "server",
          `AUTO_DELETE_EXPIRED_CANDIDATE: Purged candidate ${candidate.fullName}`,
          {
            candidateId: candidate.id,
            fullName: candidate.fullName,
            cnic: candidate.cnic,
            autoDeleteDays,
          },
          adminUserId === "system_cron" ? undefined : adminUserId
        );
      }

      logger.info("server", `Auto-delete engine executed. Purged ${deletedCount} unapproved candidate files.`, {
        autoDeleteDays,
        deletedCount,
      });

      return { deletedCount, autoDeleteDays };
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Auto delete failed";
      logger.error("server", "Failed to execute auto-delete process", { error: errMessage });
      throw new Error(`Auto delete execution failed: ${errMessage}`);
    }
  }
}
