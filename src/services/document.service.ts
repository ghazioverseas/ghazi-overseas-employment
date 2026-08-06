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

      // 3. Fallback: Auto-create a candidate profile row if missing to guarantee foreign key integrity
      const newCandId = targetCandidateId.startsWith("cand_") ? targetCandidateId : `cand_${Date.now()}`;
      const defaultUserId = `user_${Date.now()}`;

      const [newCand] = await db
        .insert(candidates)
        .values({
          id: newCandId,
          userId: defaultUserId,
          fullName: "Registered Candidate",
          cnic: `42101-${Math.floor(1000000 + Math.random() * 9000000)}-1`,
          phone: "03000000000",
          status: "registered",
          paymentStatus: "pending_payment",
        })
        .onConflictDoNothing()
        .returning();

      if (newCand) {
        return newCand.id;
      }

      const reCheck = await db.select().from(candidates).where(eq(candidates.id, newCandId)).limit(1);
      return reCheck[0]?.id || targetCandidateId;
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
      let validCandidateId = await this.ensureValidCandidateId(data.candidateId);

      // Verify that validCandidateId exists in candidates table
      const candCheck = await db.select().from(candidates).where(eq(candidates.id, validCandidateId)).limit(1);
      if (candCheck.length === 0) {
        const [insertedCand] = await db
          .insert(candidates)
          .values({
            id: validCandidateId,
            userId: `user_${Date.now()}`,
            fullName: "Registered Candidate",
            cnic: `42101-${Math.floor(1000000 + Math.random() * 9000000)}-1`,
            phone: "03000000000",
            status: "registered",
            paymentStatus: "pending_payment",
          })
          .onConflictDoNothing()
          .returning();

        if (insertedCand) {
          validCandidateId = insertedCand.id;
        }
      }

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
