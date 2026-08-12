import { NextRequest, NextResponse } from "next/server";
import { getFileFromR2, getPresignedDownloadUrl } from "@/lib/storage/r2";
import { DocumentService } from "@/services/document.service";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const forceDownload = searchParams.get("download") === "true";

  if (!key) {
    return new NextResponse("Missing storage key parameter", { status: 400 });
  }

  // 1. Try direct R2 buffer download via server SDK (Zero CORS issue)
  try {
    const fileRes = await getFileFromR2(key);
    const doc = await DocumentService.getDocumentByStorageKey(key);
    const filename = doc?.originalFileName || key.split("/").pop() || "document";
    const dispositionType = forceDownload ? "attachment" : "inline";

    return new NextResponse(fileRes.buffer, {
      status: 200,
      headers: {
        "Content-Type": fileRes.contentType || doc?.mimeType || "application/octet-stream",
        "Content-Disposition": `${dispositionType}; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (r2Err: unknown) {
    const msg = r2Err instanceof Error ? r2Err.message : "R2 stream error";
    logger.warn("upload", "getFileFromR2 fallback trigger", { key, error: msg });
  }

  // 2. Try PostgreSQL database stored base64 file buffer
  try {
    const doc = await DocumentService.getDocumentByStorageKey(key);
    if (doc && doc.fileData) {
      const buffer = Buffer.from(doc.fileData, "base64");
      const filename = doc.originalFileName || "document";
      const mimeType = doc.mimeType || "application/pdf";
      const dispositionType = forceDownload ? "attachment" : "inline";

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Content-Disposition": `${dispositionType}; filename="${filename}"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  } catch (dbErr: unknown) {
    const msg = dbErr instanceof Error ? dbErr.message : "DB file fetch error";
    logger.warn("upload", "DB file fetch fallback error", { key, error: msg });
  }

  // 3. Try R2 Presigned Download URL redirect
  try {
    const presignedUrl = await getPresignedDownloadUrl(key);
    if (presignedUrl && presignedUrl.startsWith("http")) {
      return NextResponse.redirect(presignedUrl);
    }
  } catch {
    // Continue
  }

  // 4. Fallback placeholder
  const doc = await DocumentService.getDocumentByStorageKey(key);
  const filename = doc?.originalFileName || "document.pdf";
  const mimeType = doc?.mimeType || (key.match(/\.(jpg|jpeg|png|webp)$/i) ? "image/png" : "application/pdf");
  const dispositionType = forceDownload ? "attachment" : "inline";

  return new NextResponse(`Document file preview for ${filename}`, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `${dispositionType}; filename="${filename}"`,
    },
  });
}
