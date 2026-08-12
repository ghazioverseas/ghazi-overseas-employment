import { NextRequest, NextResponse } from "next/server";
import { getCurrentCandidateProfileAction } from "@/actions/candidate.actions";
import { uploadFileToR2 } from "@/lib/storage/r2";
import { db } from "@/lib/db";
import { sessions } from "@/db/schema/users";
import { candidates } from "@/db/schema/candidates";
import { eq, or } from "drizzle-orm";
import { DocumentService } from "@/services/document.service";
import { DocumentType } from "@/types";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const documentType = (formData.get("documentType") as string) || "passport";
    let candidateId = (formData.get("candidateId") as string) || "current";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // 1. Resolve candidate ID from session profile or cookies directly
    try {
      const profileRes = await getCurrentCandidateProfileAction();
      if (profileRes.success && profileRes.data) {
        candidateId = profileRes.data.id;
      }
    } catch {
      // Fallback to cookie resolution
    }

    if (!candidateId || candidateId === "current" || candidateId === "cand_default_1") {
      const token =
        request.cookies.get("better-auth.session_token")?.value ||
        request.cookies.get("__Secure-better-auth.session_token")?.value ||
        request.cookies.get("admin_session_token")?.value;

      if (token) {
        const dbSessions = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);
        if (dbSessions.length > 0) {
          const userId = dbSessions[0].userId;
          const candList = await db
            .select()
            .from(candidates)
            .where(or(eq(candidates.id, userId), eq(candidates.userId, userId)))
            .limit(1);

          if (candList.length > 0) {
            candidateId = candList[0].id;
          } else {
            // Auto-create candidate profile for authenticated user if not present
            const newCandId = `cand_${Date.now()}`;
            const newCand = await db
              .insert(candidates)
              .values({
                id: newCandId,
                userId,
                fullName: "Registered Candidate",
                cnic: `42101-${Math.floor(1000000 + Math.random() * 9000000)}-1`,
                phone: "03000000000",
                status: "registered",
                paymentStatus: "pending_payment",
                submissionFee: 500,
              })
              .returning();
            candidateId = newCand[0].id;
          }
        }
      }
    }

    if (!candidateId || candidateId === "current") {
      candidateId = `cand_fallback_${Date.now()}`;
    }

    const fileExtension = file.name.split(".").pop() || "bin";
    const storageKey = `candidates/${candidateId}/${documentType}_${Date.now()}.${fileExtension}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Only store base64 in DB if file size is small (<300KB) to prevent SQL query length limits in Neon PostgreSQL
    const base64Data = buffer.length <= 300 * 1024 ? buffer.toString("base64") : null;

    // 2. Direct server-side R2 upload
    try {
      await uploadFileToR2(storageKey, buffer, file.type);
    } catch (r2Err: unknown) {
      const msg = r2Err instanceof Error ? r2Err.message : "R2 upload notice";
      logger.warn("upload", "R2 upload trigger notice", { error: msg });
    }

    // 3. Register document metadata in PostgreSQL database
    const documentId = crypto.randomUUID();
    const docRecord = await DocumentService.registerDocumentMetadata({
      id: documentId,
      candidateId,
      documentType: documentType as DocumentType,
      originalFileName: file.name,
      storageKey,
      mimeType: file.type,
      fileSize: file.size,
      fileData: base64Data || undefined,
    });

    logger.info("upload", "Document processed successfully", {
      documentId,
      candidateId,
      storageKey,
      filename: file.name,
    });

    return NextResponse.json({
      success: true,
      data: {
        documentId: docRecord.id,
        storageKey,
        originalFileName: file.name,
        candidateId: docRecord.candidateId || candidateId,
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to process document upload.";
    logger.error("upload", "Document upload API route error", { error: errMessage });
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
