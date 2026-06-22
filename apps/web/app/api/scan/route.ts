import { NextResponse } from "next/server";
import { mockReport } from "@/lib/mock-scan";

export async function GET() {
  return NextResponse.json({
    ok: true,
    mode: "mock",
    report: mockReport
  });
}

export async function POST() {
  return NextResponse.json({
    ok: true,
    mode: "mock",
    report: mockReport
  });
}
