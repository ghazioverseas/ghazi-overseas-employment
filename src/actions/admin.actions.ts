"use server";

import { revalidatePath } from "next/cache";
import { createAdminUserSchema } from "@/validators/admin.schema";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { PaymentVerificationService } from "@/services/payment.service";
import { AutoDeleteService } from "@/services/auto-delete.service";
import { AdminService } from "@/services/admin.service";
import { ApplicationService } from "@/services/application.service";
import { logger } from "@/lib/logger";

export async function getDashboardMetricsAction() {
  try {
    const metrics = await AdminService.getDashboardMetrics();
    return { success: true, data: metrics };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch metrics.";
    logger.error("database", "getDashboardMetricsAction error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function getAllCandidatesAction() {
  try {
    const candidatesList = await AdminService.getAllCandidates();
    return { success: true, data: candidatesList };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch candidates.";
    logger.error("database", "getAllCandidatesAction error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function getAllApplicationsAction() {
  try {
    const candidatesList = await AdminService.getAllCandidates();
    return { success: true, data: candidatesList };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch applications.";
    logger.error("database", "getAllApplicationsAction error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function getApplicationDetailsAction(candidateId: string) {
  try {
    const details = await ApplicationService.getApplicationDetails(candidateId);
    return { success: true, data: details };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch application details.";
    logger.error("database", "getApplicationDetailsAction error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function getPendingPaymentsAction() {
  try {
    const pendingList = await PaymentVerificationService.getPendingPayments();
    return { success: true, data: pendingList };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch pending payments.";
    logger.error("database", "getPendingPaymentsAction error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function getAllSystemLogsAction() {
  try {
    const logs = await AdminService.getAllSystemLogs();
    return { success: true, data: logs };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch system logs.";
    logger.error("database", "getAllSystemLogsAction error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function getAllAdminUsersAction() {
  try {
    const usersList = await AdminService.getAllAdminUsers();
    return { success: true, data: usersList };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch admin users.";
    logger.error("database", "getAllAdminUsersAction error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function createAdminUserAction(formData: unknown) {
  try {
    const validated = createAdminUserSchema.parse(formData);

    // 1. Check if account already exists in DB
    const existing = await db.select().from(users).where(eq(users.email, validated.email)).limit(1);

    if (existing.length > 0) {
      await db.update(users).set({ role: "admin" }).where(eq(users.id, existing[0].id));
      revalidatePath("/admin/admins");
      logger.info("auth", "Promoted existing user account to admin role", { email: validated.email });
      return {
        success: true,
        message: `User account ${validated.email} was updated to Administrator.`,
        user: { ...existing[0], role: "admin" },
      };
    }

    // 2. Create user account via Better Auth
    const newUser = await auth.api.signUpEmail({
      body: {
        email: validated.email,
        password: validated.password,
        name: validated.fullName,
      },
    });

    if (!newUser || !newUser.user) {
      return { success: false, error: "Failed to create admin user account." };
    }

    // 3. Explicitly update role to 'admin' in the database users table
    await db.update(users).set({ role: "admin" }).where(eq(users.id, newUser.user.id));

    revalidatePath("/admin/admins");

    logger.info("auth", "New admin account created successfully", { email: validated.email });
    return {
      success: true,
      message: `Admin account for ${validated.fullName} created successfully.`,
      user: { ...newUser.user, role: "admin" },
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to create admin user.";
    logger.error("auth", "Create admin error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function verifyPaymentAction(formData: {
  candidateId: string;
  decision: "approve" | "reject" | "request_new";
  reason?: string;
}) {
  try {
    const adminUserId = "admin_super_user";

    const updated = await PaymentVerificationService.verifyPayment({
      candidateId: formData.candidateId,
      decision: formData.decision,
      adminUserId,
      reason: formData.reason,
    });

    return {
      success: true,
      message: `Payment verification decision ${formData.decision.toUpperCase()} recorded.`,
      data: updated,
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Payment verification error.";
    logger.error("server", "Verify payment action error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function runAutoDeleteAction() {
  try {
    const result = await AutoDeleteService.runAutoDeleteCheck("admin_super_user");
    return {
      success: true,
      message: `Auto-delete completed. Purged ${result.deletedCount} expired unapproved files older than ${result.autoDeleteDays} days.`,
      data: result,
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Auto-delete failed.";
    return { success: false, error: errMessage };
  }
}
