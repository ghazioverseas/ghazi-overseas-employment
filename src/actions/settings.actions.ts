"use server";

import { revalidatePath } from "next/cache";
import { adminSettingsSchema } from "@/validators/admin.schema";
import { db } from "@/lib/db";
import { adminSettings } from "@/db/schema/settings";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { LogService } from "@/services/log.service";
import { SettingsService } from "@/services/settings.service";

export async function getAdminSettingsAction() {
  try {
    const settings = await SettingsService.getPaymentSettings();
    return { success: true, data: settings };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch settings.";
    return { success: false, error: errMessage };
  }
}

export async function updateAdminSettingsAction(formData: unknown) {
  try {
    const validated = adminSettingsSchema.parse(formData);

    // 1. Ensure default settings row exists in DB
    const existing = await db.select().from(adminSettings).where(eq(adminSettings.id, "default_settings")).limit(1);

    let updatedRecord;
    if (existing.length > 0) {
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
      updatedRecord = updated[0];
    } else {
      const inserted = await db
        .insert(adminSettings)
        .values({
          id: "default_settings",
          ...validated,
        })
        .returning();
      updatedRecord = inserted[0];
    }

    // 2. Safely record system log without foreign key violations
    await LogService.recordLog(
      "info",
      "server",
      "UPDATE_ADMIN_SETTINGS: Updated admin payment & feature settings",
      validated as unknown as Record<string, unknown>
    );

    revalidatePath("/", "layout");

    logger.info("server", "Admin settings updated successfully", { settingsId: "default_settings" });

    return {
      success: true,
      message: "Admin payment, general, and document settings updated instantly.",
      data: updatedRecord,
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update admin settings.";
    logger.error("server", "Admin settings update error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}
