import { NextRequest, NextResponse } from "next/server";
import { getPresignedDownloadUrl } from "@/lib/storage/r2";
import { DocumentService } from "@/services/document.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return new NextResponse("Missing storage key parameter", { status: 400 });
  }

  try {
    const presignedUrl = await getPresignedDownloadUrl(key);
    if (presignedUrl && presignedUrl.startsWith("http")) {
      return NextResponse.redirect(presignedUrl);
    }
  } catch {
    // Continue to database fallback
  }

  const doc = await DocumentService.getDocumentByStorageKey(key);
  const filename = doc?.originalFileName || "document.pdf";
  const mimeType = doc?.mimeType || (key.match(/\.(jpg|jpeg|png|webp)$/i) ? "image/png" : "application/pdf");

  return new NextResponse(`Document file placeholder for ${filename}`, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
