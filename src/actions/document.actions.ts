"use server";

import { documentUploadSchema } from "@/validators/document.schema";
import { getPresignedUploadUrl } from "@/lib/storage/r2";
import { DocumentService } from "@/services/document.service";
import { logger } from "@/lib/logger";

export async function requestDocumentUploadUrlAction(formData: unknown) {
  try {
    const validated = documentUploadSchema.parse(formData);
    
    // Generate unique Cloudflare R2 storage key
    const fileExtension = validated.originalFileName.split(".").pop() || "bin";
    const storageKey = `candidates/${validated.candidateId}/${validated.documentType}_${Date.now()}.${fileExtension}`;

    // Generate R2 S3 presigned PUT URL
    const uploadUrl = await getPresignedUploadUrl(storageKey, validated.mimeType);

    // Create database metadata record
    const documentId = crypto.randomUUID();
    const docRecord = await DocumentService.registerDocumentMetadata({
      id: documentId,
      candidateId: validated.candidateId,
      documentType: validated.documentType,
      originalFileName: validated.originalFileName,
      storageKey,
      mimeType: validated.mimeType,
      fileSize: validated.fileSize,
    });

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
