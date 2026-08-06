import { db } from "@/lib/db";
import { documents } from "@/db/schema/documents";
import { candidates } from "@/db/schema/candidates";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { DocumentType } from "@/types";

export class DocumentService {
  private static async ensureValidCandidateId(targetCandidateId: string): Promise<string> {
    try {
      if (!targetCandidateId) return "";

      // 1. Check if candidate record exists by candidate ID
      const existing = await db
        .select()
        .from(candidates)
        .where(eq(candidates.id, targetCandidateId))
        .limit(1);

      if (existing.length > 0) {
        return existing[0].id;
      }

      // 2. Check if targetCandidateId is a user ID
      const existingByUser = await db
        .select()
        .from(candidates)
        .where(eq(candidates.userId, targetCandidateId))
        .limit(1);

      if (existingByUser.length > 0) {
        return existingByUser[0].id;
      }

      return targetCandidateId;
    } catch {
      return targetCandidateId;
    }
  }

  static async getDocumentsByCandidateId(candidateId: string) {
    try {
      if (!candidateId) return [];
      const validId = await this.ensureValidCandidateId(candidateId);
      if (!validId) return [];

      return await db
        .select()
        .from(documents)
        .where(eq(documents.candidateId, validId));
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("database", "Failed to fetch candidate documents", { candidateId, error: errMessage });
      return [];
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
      const validCandidateId = await this.ensureValidCandidateId(data.candidateId);

      const inserted = await db
        .insert(documents)
        .values({
          id: data.id,
          candidateId: validCandidateId,
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
        candidateId: validCandidateId,
        storageKey: data.storageKey,
      });

      return inserted[0];
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("database", "Failed to save document metadata", { data, error: errMessage });
      throw new Error(`Failed to insert document metadata into database: ${errMessage}`);
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
      return null;
    }
  }
}
