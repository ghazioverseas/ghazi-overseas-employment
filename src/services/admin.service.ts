import { db } from "@/lib/db";
import { candidates } from "@/db/schema/candidates";
import { users } from "@/db/schema/users";
import { documents } from "@/db/schema/documents";
import { systemLogs } from "@/db/schema/logs";
import { eq, sql, desc, gte } from "drizzle-orm";
import { logger } from "@/lib/logger";

export class AdminService {
  static async getDashboardMetrics() {
    try {
      // 1. Candidate Counts
      const allCandidates = await db.select({ count: sql<number>`count(*)` }).from(candidates);
      const totalCandidates = Number(allCandidates[0]?.count || 0);

      const pendingApps = await db
        .select({ count: sql<number>`count(*)` })
        .from(candidates)
        .where(eq(candidates.status, "registered"));
      const totalPending = Number(pendingApps[0]?.count || 0);

      const approvedApps = await db
        .select({ count: sql<number>`count(*)` })
        .from(candidates)
        .where(eq(candidates.status, "approved"));
      const totalApproved = Number(approvedApps[0]?.count || 0);

      const rejectedApps = await db
        .select({ count: sql<number>`count(*)` })
        .from(candidates)
        .where(eq(candidates.status, "rejected"));
      const totalRejected = Number(rejectedApps[0]?.count || 0);

      const pendingPay = await db
        .select({ count: sql<number>`count(*)` })
        .from(candidates)
        .where(eq(candidates.paymentStatus, "payment_under_review"));
      const totalPendingPayments = Number(pendingPay[0]?.count || 0);

      // Today's Registrations
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayRegs = await db
        .select({ count: sql<number>`count(*)` })
        .from(candidates)
        .where(gte(candidates.createdAt, today));
      const totalToday = Number(todayRegs[0]?.count || 0);

      // Documents & Storage
      const docsCount = await db.select({ count: sql<number>`count(*)` }).from(documents);
      const totalDocuments = Number(docsCount[0]?.count || 0);

      const storageSum = await db.select({ sumBytes: sql<number>`coalesce(sum(file_size), 0)` }).from(documents);
      const totalStorageBytes = Number(storageSum[0]?.sumBytes || 0);

      return {
        totalCandidates,
        pendingApplications: totalPending,
        approvedApplications: totalApproved,
        rejectedApplications: totalRejected,
        pendingPayments: totalPendingPayments,
        todayRegistrations: totalToday,
        documentsUploaded: totalDocuments,
        storageUsedBytes: totalStorageBytes,
      };
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Database error";
      logger.error("database", "Failed to calculate admin dashboard metrics", { error: errMessage });
      return {
        totalCandidates: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
        pendingPayments: 0,
        todayRegistrations: 0,
        documentsUploaded: 0,
        storageUsedBytes: 0,
      };
    }
  }

  static async getAllCandidates() {
    try {
      return await db.select().from(candidates).orderBy(desc(candidates.createdAt));
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Database error";
      logger.error("database", "Failed to fetch all candidates", { error: errMessage });
      return [];
    }
  }

  static async getAllSystemLogs() {
    try {
      return await db.select().from(systemLogs).orderBy(desc(systemLogs.createdAt)).limit(100);
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Database error";
      logger.error("database", "Failed to fetch system logs", { error: errMessage });
      return [];
    }
  }

  static async getAllAdminUsers() {
    try {
      return await db.select().from(users).where(eq(users.role, "admin")).orderBy(desc(users.createdAt));
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Database error";
      logger.error("database", "Failed to fetch admin users", { error: errMessage });
      return [];
    }
  }
}
