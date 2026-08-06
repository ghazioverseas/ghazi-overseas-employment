"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { CandidateService } from "@/services/candidate.service";
import { logger } from "@/lib/logger";

export async function getCurrentCandidateProfileAction() {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

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

    return { success: true, data: candidate };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch candidate profile.";
    logger.error("auth", "getCurrentCandidateProfileAction error", { error: errMessage });
    return { success: false, error: errMessage };
  }
}
