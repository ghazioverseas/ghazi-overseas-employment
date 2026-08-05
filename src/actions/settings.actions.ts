"use server";

import { adminSettingsSchema } from "@/validators/admin.schema";
import { db } from "@/lib/db";
import { adminSettings } from "@/db/schema/settings";
import { systemLogs } from "@/db/schema/logs";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

export async function updateAdminSettingsAction(formData: unknown) {
  try {
    const validated = adminSettingsSchema.parse(formData);

    const updated = await db
      .update(adminSettings)
      .set({
        companyName: validated.companyName,
        companyWebsite: validated.companyWebsite,
        companyAddress: validated.companyAddress,
        companyPhone: validated.companyPhone,
        companyEmail: validated.companyEmail,
        submissionFee: validated.submissionFee,
        isSubmissionFeeEnabled: validated.isSubmissionFeeEnabled,
        bankName: validated.bankName,
        accountTitle: validated.accountTitle,
        accountNumber: validated.accountNumber,
        iban: validated.iban,
        showBank: validated.showBank,
        easypaisaTitle: validated.easypaisaTitle,
        easypaisaNumber: validated.easypaisaNumber,
        showEasypaisa: validated.showEasypaisa,
        jazzcashTitle: validated.jazzcashTitle,
        jazzcashNumber: validated.jazzcashNumber,
        showJazzcash: validated.showJazzcash,
        autoDeleteDays: validated.autoDeleteDays,
        maxUploadSizeMb: validated.maxUploadSizeMb,
        updatedAt: new Date(),
      })
      .where(eq(adminSettings.id, "default_settings"))
      .returning();

    // Log admin settings update matching systemLogs schema
    await db.insert(systemLogs).values({
      id: crypto.randomUUID(),
      level: "info",
      category: "server",
      message: "UPDATE_ADMIN_SETTINGS: Updated admin payment & feature settings",
      metadata: validated,
      userId: "admin_super_user",
    });

    logger.info("server", "Admin settings updated successfully", { settingsId: "default_settings" });

    return {
      success: true,
      message: "Admin payment, general, and document settings updated instantly.",
      data: updated[0],
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update admin settings.";
    logger.error("server", "Admin settings update error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}
