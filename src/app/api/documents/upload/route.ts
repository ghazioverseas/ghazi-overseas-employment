import { NextResponse } from "next/server";
import { requestDocumentUploadUrlAction } from "@/actions/document.actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await requestDocumentUploadUrlAction(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal server error during document presigned upload.";
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
