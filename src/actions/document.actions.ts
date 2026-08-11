"use server";

import { revalidatePath } from "next/cache";
import { documentUploadSchema } from "@/validators/document.schema";
import { getPresignedUploadUrl, getPresignedDownloadUrl } from "@/lib/storage/r2";
import { DocumentService } from "@/services/document.service";
import { getCurrentCandidateProfileAction } from "@/actions/candidate.actions";
import { logger } from "@/lib/logger";

export async function requestDocumentUploadUrlAction(formData: unknown) {
  try {
    const validated = documentUploadSchema.parse(formData);

    // Always resolve candidate ID from authenticated session first
    let candidateId = validated.candidateId;
    const profileRes = await getCurrentCandidateProfileAction();
    if (profileRes.success && profileRes.data) {
      candidateId = profileRes.data.id;
    } else if (!candidateId || candidateId === "current" || candidateId === "cand_default_1" || candidateId === "demo_candidate_id") {
      // No session and no valid ID - this shouldn't happen for authenticated users
      throw new Error("Unable to resolve candidate profile. Please ensure you are logged in.");
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

    // Note: Do NOT call revalidatePath here — it remounts the client component
    // and resets all React state, causing uploaded documents to disappear from the UI.

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
        candidateId: docRecord.candidateId || candidateId,
      },
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to process document upload request.";
    logger.error("upload", "Failed to generate document upload URL", { error: errMessage });
    return { success: false, error: errMessage };
  }
}


export async function getCandidateDocumentsAction(candidateId?: string) {
  try {
    // Always try to resolve the real candidate profile from the auth session first
    const profileRes = await getCurrentCandidateProfileAction();
    const sessionCandidateId = profileRes.success && profileRes.data ? profileRes.data.id : null;
    const sessionUserId = profileRes.success && profileRes.data ? profileRes.data.userId : null;

    // Use the most reliable ID: session-resolved candidate ID > passed candidateId
    const primaryId = sessionCandidateId || candidateId;
    
    if (!primaryId || primaryId === "current" || primaryId === "cand_default_1" || primaryId === "demo_candidate_id") {
      return { success: true, data: [] };
    }

    // Pass both candidate ID and userId so the service can match documents stored under either
    const docs = await DocumentService.getDocumentsByCandidateId(primaryId);
    
    // If no docs found with primaryId but we have a userId, also try with userId directly
    if (docs.length === 0 && sessionUserId && sessionUserId !== primaryId) {
      const docsByUser = await DocumentService.getDocumentsByCandidateId(sessionUserId);
      if (docsByUser.length > 0) {
        return { success: true, data: docsByUser };
      }
    }
    
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

export async function getAllDocumentsAction() {
  try {
    const docs = await DocumentService.getAllDocuments();
    return { success: true, data: docs };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch documents.";
    return { success: false, error: errMessage };
  }
}

export async function deleteDocumentAction(documentId: string) {
  try {
    await DocumentService.deleteDocument(documentId);
    revalidatePath("/admin/documents");
    revalidatePath("/candidate/documents");
    return { success: true, message: "Document deleted successfully." };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete document.";
    return { success: false, error: errMessage };
  }
}
