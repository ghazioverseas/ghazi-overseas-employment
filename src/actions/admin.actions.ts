"use server";

import { createAdminUserSchema } from "@/validators/admin.schema";
import { auth } from "@/lib/auth/auth";
import { PaymentVerificationService } from "@/services/payment.service";
import { AutoDeleteService } from "@/services/auto-delete.service";
import { logger } from "@/lib/logger";

export async function createAdminUserAction(formData: unknown) {
  try {
    const validated = createAdminUserSchema.parse(formData);

    const newUser = await auth.api.signUpEmail({
      body: {
        email: validated.email,
        password: validated.password,
        name: validated.fullName,
      },
    });

    logger.info("auth", "New admin user account created", { email: validated.email });
    return {
      success: true,
      message: "Admin account created successfully.",
      user: newUser.user,
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
