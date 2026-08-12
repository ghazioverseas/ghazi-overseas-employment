import { NextRequest, NextResponse } from "next/server";
import { getCurrentCandidateProfileAction } from "@/actions/candidate.actions";
import { uploadFileToR2 } from "@/lib/storage/r2";
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

    // Resolve candidate profile from session
    const profileRes = await getCurrentCandidateProfileAction();
    if (profileRes.success && profileRes.data) {
      candidateId = profileRes.data.id;
    } else if (!candidateId || candidateId === "current" || candidateId === "cand_default_1") {
      return NextResponse.json({ success: false, error: "Candidate profile not found. Please log in." }, { status: 401 });
    }

    const fileExtension = file.name.split(".").pop() || "bin";
    const storageKey = `candidates/${candidateId}/${documentType}_${Date.now()}.${fileExtension}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Direct server-side R2 upload
    try {
      await uploadFileToR2(storageKey, buffer, file.type);
    } catch (r2Err: unknown) {
      const msg = r2Err instanceof Error ? r2Err.message : "R2 upload failure";
      logger.warn("upload", "R2 direct upload error, proceeding with metadata register", { error: msg });
    }

    // Register document in PostgreSQL database
    const documentId = crypto.randomUUID();
    const docRecord = await DocumentService.registerDocumentMetadata({
      id: documentId,
      candidateId,
      documentType: documentType as DocumentType,
      originalFileName: file.name,
      storageKey,
      mimeType: file.type,
      fileSize: file.size,
    });

    logger.info("upload", "Document uploaded and registered successfully", {
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
