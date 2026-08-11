"use server";

import { getSessionFromRequest } from "@/lib/auth/get-session";
import { CandidateService } from "@/services/candidate.service";
import { logger } from "@/lib/logger";

export async function getCurrentCandidateProfileAction() {
  try {
    const session = await getSessionFromRequest();

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized: Candidate session invalid." };
    }

    const userId = session.user.id;
    let candidate = await CandidateService.getCandidateByUserId(userId);

    // If profile record does not exist for logged in user, create default profile
    if (!candidate) {
      candidate = await CandidateService.createCandidateProfile({
        id: `cand_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        fullName: session.user.name || "Registered Candidate",
        cnic: `42101-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1 + Math.random() * 9)}`,
        phone: "03000000000",
      });
    }

    return {
      success: true,
      data: {
        ...candidate,
        email: session.user.email,
      },
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch candidate profile.";
    logger.error("auth", "getCurrentCandidateProfileAction error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function updateCandidateProfileAction(formData: {
  fullName?: string;
  fatherName?: string;
  cnic?: string;
  passportNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  profession?: string;
  yearsOfExperience?: number;
  education?: string;
}) {
  try {
    const session = await getSessionFromRequest();

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized: Candidate session invalid." };
    }

    const userId = session.user.id;
    const updated = await CandidateService.updateCandidateProfileByUserId(userId, formData);
    return {
      success: true,
      data: {
        ...updated,
        email: session.user.email,
      },
      message: "Profile updated successfully.",
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update profile.";
    logger.error("auth", "updateCandidateProfileAction error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}
