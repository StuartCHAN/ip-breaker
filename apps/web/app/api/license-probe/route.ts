import { NextResponse } from "next/server";
import { airBoardPackageJson, analyzePackageJson, type PackageJsonLike } from "@/lib/license-probe";

export async function GET() {
  return NextResponse.json({
    ok: true,
    mode: "sample",
    input: airBoardPackageJson,
    result: analyzePackageJson(airBoardPackageJson)
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { packageJson?: PackageJsonLike };
    const packageJson = body.packageJson ?? airBoardPackageJson;

    return NextResponse.json({
      ok: true,
      mode: "submitted",
      input: packageJson,
      result: analyzePackageJson(packageJson)
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid JSON body. Expected { packageJson: { dependencies, devDependencies } }."
      },
      { status: 400 }
    );
  }
}
