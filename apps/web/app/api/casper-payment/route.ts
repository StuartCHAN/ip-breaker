import { NextResponse } from "next/server";
import { getCasperPaymentRequirements, verifyCasperPayment } from "@/lib/casper-payment";

export async function GET() {
  return NextResponse.json({
    ok: true,
    paymentRequirements: getCasperPaymentRequirements()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deployHash = typeof body.deployHash === "string" ? body.deployHash : "";
    const verification = await verifyCasperPayment(deployHash);

    return NextResponse.json(verification, {
      status: verification.ok ? 200 : 402
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        status: "bad_request",
        message: "Expected JSON body with a deployHash field.",
        paymentRequirements: getCasperPaymentRequirements(),
        error
      },
      { status: 400 }
    );
  }
}
