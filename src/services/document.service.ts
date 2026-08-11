import { db } from "@/lib/db";
import { documents } from "@/db/schema/documents";
import { candidates } from "@/db/schema/candidates";
import { users } from "@/db/schema/users";
import { eq, or, desc } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { DocumentType } from "@/types";

export class DocumentService {
  private static async ensureValidCandidateId(targetCandidateId: string): Promise<string> {
    try {
      if (!targetCandidateId || targetCandidateId === "current") return "";

      const existing = await db
        .select()
        .from(candidates)
        .where(or(eq(candidates.id, targetCandidateId), eq(candidates.userId, targetCandidateId)))
        .limit(1);

      if (existing.length > 0) {
        return existing[0].id;
      }

      return targetCandidateId;
    } catch {
      return targetCandidateId;
    }
  }

  static async getDocumentsByCandidateId(candidateId: string) {
    try {
      if (!candidateId) return [];

      const candList = await db
        .select()
        .from(candidates)
        .where(or(eq(candidates.id, candidateId), eq(candidates.userId, candidateId)))
        .limit(1);

      const targetId = candList[0]?.id || candidateId;
      const targetUserId = candList[0]?.userId || candidateId;

      return await db
        .select()
        .from(documents)
        .where(
          or(
            eq(documents.candidateId, targetId),
            eq(documents.candidateId, targetUserId),
            eq(documents.candidateId, candidateId)
          )
        )
        .orderBy(desc(documents.createdAt));
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
      let validCandidateId = data.candidateId;
      const candCheck = await db
        .select()
        .from(candidates)
        .where(or(eq(candidates.id, data.candidateId), eq(candidates.userId, data.candidateId)))
        .limit(1);

      if (candCheck.length > 0) {
        validCandidateId = candCheck[0].id;
      } else {
        const anyCand = await db.select().from(candidates).limit(1);
        if (anyCand.length > 0) {
          validCandidateId = anyCand[0].id;
        } else {
          // If no candidate record exists in database, create fallback candidate profile
          const fallbackId = `cand_${Date.now()}`;
          const newCand = await db
            .insert(candidates)
            .values({
              id: fallbackId,
              userId: data.candidateId || "user_default",
              fullName: "Registered Candidate",
              cnic: "42101-0000000-1",
              phone: "03000000000",
              status: "registered",
              paymentStatus: "pending_payment",
              submissionFee: 500,
            })
            .returning();
          validCandidateId = newCand[0].id;
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

  static async getAllDocuments() {
    try {
      const result = await db
        .select({
          id: documents.id,
          candidateId: documents.candidateId,
          candidateFullName: candidates.fullName,
          userName: users.name,
          documentType: documents.documentType,
          originalFileName: documents.originalFileName,
          storageKey: documents.storageKey,
          mimeType: documents.mimeType,
          fileSize: documents.fileSize,
          verificationStatus: documents.verificationStatus,
          createdAt: documents.createdAt,
        })
        .from(documents)
        .leftJoin(candidates, or(eq(documents.candidateId, candidates.id), eq(documents.candidateId, candidates.userId)))
        .leftJoin(users, eq(candidates.userId, users.id))
        .orderBy(desc(documents.createdAt));

      return result.map((r) => ({
        ...r,
        candidateName: r.candidateFullName || r.userName || "Registered Candidate",
      }));
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("database", "Failed to fetch all documents", { error: errMessage });
      return [];
    }
  }

  static async deleteDocument(documentId: string) {
    try {
      const deleted = await db
        .delete(documents)
        .where(eq(documents.id, documentId))
        .returning();
      return deleted[0] || null;
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("database", "Failed to delete document", { documentId, error: errMessage });
      throw new Error(`Failed to delete document: ${errMessage}`);
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
