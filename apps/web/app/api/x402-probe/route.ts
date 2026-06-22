import { NextResponse } from "next/server";
import { airBoardPackageJson, analyzePackageJson } from "@/lib/license-probe";

const paymentRequirements = {
  x402Version: "mock-0.1",
  accepts: [
    {
      scheme: "exact",
      network: "casper-testnet",
      maxAmountRequired: "0.10",
      payTo: "casper-testnet:mock-probe-provider",
      asset: "CSPR",
      resource: "/api/x402-probe",
      description: "License Contamination Probe for AirBoard sample package metadata"
    }
  ]
};

export async function GET(request: Request) {
  const paidHeader = request.headers.get("x-mock-payment");

  if (paidHeader !== "paid") {
    return NextResponse.json(
      {
        ok: false,
        code: "PAYMENT_REQUIRED",
        message: "This specialized IP probe requires an x402-style payment before returning scan results.",
        paymentRequirements
      },
      { status: 402 }
    );
  }

  const probeResult = analyzePackageJson(airBoardPackageJson);

  return NextResponse.json({
    ok: true,
    mode: "mock-x402-paid-probe",
    payment: {
      status: "settled-mock",
      receiptHash: "0xprobe_receipt_7e2f9c9a7c_license_probe_paid",
      network: "casper-testnet",
      amount: "0.10 CSPR"
    },
    probe: {
      id: "license-contamination-probe",
      title: "License Contamination Attack",
      result: probeResult
    }
  });
}
