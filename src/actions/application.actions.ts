"use server";

import { ApplicationService } from "@/services/application.service";
import { logger } from "@/lib/logger";

export async function executeApplicationAction(formData: {
  candidateId: string;
  action: "approve" | "reject" | "return_correction" | "request_missing" | "mark_processing" | "mark_completed";
  reason?: string;
}) {
  try {
    const adminUserId = "admin_super_user";
    const adminName = "Ghazi Chief Administrator";

    const updated = await ApplicationService.executeApplicationAction({
      candidateId: formData.candidateId,
      action: formData.action,
      reason: formData.reason,
      adminUserId,
      adminName,
    });

    return {
      success: true,
      message: `Application action ${formData.action.toUpperCase()} executed successfully.`,
      data: updated,
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to execute action.";
    logger.error("server", "Application action error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function addApplicationNoteAction(candidateId: string, note: string) {
  try {
    const adminUserId = "admin_super_user";
    const adminName = "Ghazi Chief Administrator";

    const added = await ApplicationService.addApplicationNote(candidateId, adminUserId, adminName, note);
    return { success: true, message: "Note added to application file.", data: added };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to add note.";
    return { success: false, error: errMessage };
  }
}
