import { db } from "@/lib/db";
import { documents } from "@/db/schema/documents";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { DocumentType } from "@/types";

export class DocumentService {
  static async getDocumentsByCandidateId(candidateId: string) {
    try {
      return await db
        .select()
        .from(documents)
        .where(eq(documents.candidateId, candidateId));
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("database", "Failed to fetch candidate documents", { candidateId, error: errMessage });
      throw new Error("Database query failed while retrieving document records");
    }
  }

  static async registerDocumentMetadata(data: {
    id: string;
    candidateId: string;
    documentType: DocumentType;
    originalFileName: string;
    storageKey: string;
    mimeType: string;
    fileSize: number;
  }) {
    try {
      const inserted = await db
        .insert(documents)
        .values({
          id: data.id,
          candidateId: data.candidateId,
          documentType: data.documentType,
          originalFileName: data.originalFileName,
          storageKey: data.storageKey,
          mimeType: data.mimeType,
          fileSize: data.fileSize,
          verificationStatus: "pending",
        })
        .returning();

      logger.info("upload", "Document metadata saved successfully", {
        documentId: data.id,
        candidateId: data.candidateId,
        storageKey: data.storageKey,
      });

      return inserted[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("database", "Failed to save document metadata", { data, error: errMessage });
      throw new Error("Failed to insert document metadata into database");
    }
  }

  static async getDocumentByStorageKey(storageKey: string) {
    try {
      const result = await db
        .select()
        .from(documents)
        .where(eq(documents.storageKey, storageKey))
        .limit(1);
      return result[0] || null;
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("database", "Failed to get document by storage key", { storageKey, error: errMessage });
      throw new Error("Database error while retrieving document metadata");
    }
  }
}
