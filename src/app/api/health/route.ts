import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    appName: "Ghazi Overseas Employment Portal",
    company: "Ghazi Overseas Employment Pakistan",
    license: "OPEP-1234",
    timestamp: new Date().toISOString(),
  });
}
