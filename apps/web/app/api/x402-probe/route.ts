import { NextResponse } from "next/server";
import { getCasperPaymentRequirements, getPaidLicenseProbeResult, verifyCasperPayment } from "@/lib/casper-payment";

export async function GET(request: Request) {
  const deployHash = request.headers.get("x-casper-deploy-hash") ?? "";
  const paymentRequirements = getCasperPaymentRequirements();

  if (!deployHash) {
    return NextResponse.json(
      {
        ok: false,
        code: "PAYMENT_REQUIRED",
        message:
          "This specialized IP probe requires a verified Casper Testnet payment deploy hash before returning scan results.",
        paymentRequirements
      },
      { status: 402 }
    );
  }

  const verification = await verifyCasperPayment(deployHash);

  if (!verification.ok) {
    return NextResponse.json(
      {
        ok: false,
        code: "PAYMENT_NOT_VERIFIED",
        message: verification.message,
        paymentRequirements,
        verification
      },
      { status: 402 }
    );
  }

  return NextResponse.json({
    ok: true,
    mode: "casper-testnet-paid-probe",
    payment: {
      status: verification.status,
      receiptHash: verification.deployHash,
      network: "casper-testnet",
      amount: verification.observed?.amountCSPR ? `${verification.observed.amountCSPR} CSPR` : undefined,
      target: verification.observed?.target,
      blockHash: verification.observed?.blockHash
    },
    probe: {
      id: "license-contamination-probe",
      title: "License Contamination Attack",
      result: getPaidLicenseProbeResult()
    }
  });
}
