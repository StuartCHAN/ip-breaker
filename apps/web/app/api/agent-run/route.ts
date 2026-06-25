import { NextResponse } from "next/server";
import { getAirBoardAgentRun } from "@/lib/ip-agent/agent-run";

export async function GET() {
  return NextResponse.json({
    ok: true,
    mode: "evidence-backed-ip-agent",
    report: getAirBoardAgentRun()
  });
}
