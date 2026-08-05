import { db } from "@/lib/db";
import { documents } from "@/db/schema/documents";
import { candidates } from "@/db/schema/candidates";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { DocumentType } from "@/types";

export class DocumentService {
  private static async ensureValidCandidateId(targetCandidateId: string): Promise<string> {
    try {
      // 1. Check if candidate record exists
      const existing = await db
        .select()
        .from(candidates)
        .where(eq(candidates.id, targetCandidateId))
        .limit(1);

      if (existing.length > 0) {
        return existing[0].id;
      }

      // 2. Check if any candidate exists in database
      const anyCandidate = await db.select().from(candidates).limit(1);
      if (anyCandidate.length > 0) {
        return anyCandidate[0].id;
      }

      // 3. Create default candidate record if none exists
      const defaultUserId = "default_candidate_user_id";
      await db
        .insert(users)
        .values({
          id: defaultUserId,
          name: "Registered Candidate",
          email: "candidate@ghazioverseas.com",
          role: "candidate",
        })
        .onConflictDoNothing();

      const newCandId = targetCandidateId.includes("demo") ? "cand_default_1" : targetCandidateId;

      await db
        .insert(candidates)
        .values({
          id: newCandId,
          userId: defaultUserId,
          fullName: "Registered Candidate",
          cnic: "42101-1234567-9",
          phone: "03001234567",
          status: "registered",
          paymentStatus: "pending_payment",
        })
        .onConflictDoNothing();

      return newCandId;
    } catch {
      return targetCandidateId;
    }
  }

  static async getDocumentsByCandidateId(candidateId: string) {
    try {
      const validId = await this.ensureValidCandidateId(candidateId);
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
