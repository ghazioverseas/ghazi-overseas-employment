"use server";

import { revalidatePath } from "next/cache";
import { documentUploadSchema } from "@/validators/document.schema";
import { getPresignedUploadUrl, getPresignedDownloadUrl } from "@/lib/storage/r2";
import { DocumentService } from "@/services/document.service";
import { logger } from "@/lib/logger";

export async function requestDocumentUploadUrlAction(formData: unknown) {
  try {
    const validated = documentUploadSchema.parse(formData);

    let candidateId = validated.candidateId;
    const profileRes = await getCurrentCandidateProfileAction();
    if (profileRes.success && profileRes.data) {
      candidateId = profileRes.data.id;
    }
    
    // Generate unique Cloudflare R2 storage key
    const fileExtension = validated.originalFileName.split(".").pop() || "bin";
    const storageKey = `candidates/${candidateId}/${validated.documentType}_${Date.now()}.${fileExtension}`;

    // Generate R2 S3 presigned PUT URL
    const uploadUrl = await getPresignedUploadUrl(storageKey, validated.mimeType);

    // Create database metadata record
    const documentId = crypto.randomUUID();
    const docRecord = await DocumentService.registerDocumentMetadata({
      id: documentId,
      candidateId,
      documentType: validated.documentType,
      originalFileName: validated.originalFileName,
      storageKey,
      mimeType: validated.mimeType,
      fileSize: validated.fileSize,
    });

    revalidatePath("/candidate/documents");

    logger.info("upload", "Generated presigned upload URL for Cloudflare R2", {
      documentId,
      candidateId: validated.candidateId,
      storageKey,
    });

    return {
      success: true,
      data: {
        documentId: docRecord.id,
        uploadUrl,
        storageKey,
      },
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to process document upload request.";
    logger.error("upload", "Failed to generate document upload URL", { error: errMessage });
    return { success: false, error: errMessage };
  }
}

import { getCurrentCandidateProfileAction } from "@/actions/candidate.actions";

export async function getCandidateDocumentsAction(candidateId?: string) {
  try {
    let targetId = candidateId;
    if (!targetId || targetId === "cand_default_1" || targetId === "demo_candidate_id") {
      const profileRes = await getCurrentCandidateProfileAction();
      if (profileRes.success && profileRes.data) {
        targetId = profileRes.data.id;
      }
    }
    if (!targetId) {
      return { success: true, data: [] };
    }
    const docs = await DocumentService.getDocumentsByCandidateId(targetId);
    return { success: true, data: docs };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch candidate documents.";
    logger.error("database", "getCandidateDocumentsAction error", { candidateId, error: errMessage });
    return { success: false, error: errMessage };
  }
}

export async function getPresignedDownloadUrlAction(storageKey: string) {
  try {
    if (!storageKey) {
      return { success: false, error: "Storage key is required." };
    }
    const url = await getPresignedDownloadUrl(storageKey);
    return { success: true, url };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to generate download URL.";
    logger.error("upload", "getPresignedDownloadUrlAction error", { storageKey, error: errMessage });
    return { success: false, error: errMessage };
  }
}
