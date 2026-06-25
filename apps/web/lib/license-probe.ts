export type PackageJsonLike = {
  name?: string;
  version?: string;
  license?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

export type LicenseRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";

export type LicenseProbeFinding = {
  packageName: string;
  versionRange: string;
  declaredLicense: string;
  risk: LicenseRiskLevel;
  reason: string;
  recommendation: string;
};

export type LicenseProbeResult = {
  projectName: string;
  totalDependencies: number;
  highRiskCount: number;
  mediumRiskCount: number;
  unknownCount: number;
  findings: LicenseProbeFinding[];
};

const sampleLicenseMap: Record<string, string> = {
  next: "MIT",
  react: "MIT",
  "react-dom": "MIT",
  typescript: "Apache-2.0",
  eslint: "MIT",
  "eslint-config-next": "MIT",
  prisma: "Apache-2.0",
  "@prisma/client": "Apache-2.0",
  "whiteboard-core": "GPL-3.0",
  "realtime-canvas-kit": "AGPL-3.0",
  "ai-board-templates": "UNKNOWN",
  "canvas-exporter": "LGPL-3.0",
  "collab-presence": "MPL-2.0"
};

function classifyLicense(license: string): LicenseRiskLevel {
  const normalized = license.toUpperCase().trim();
  if (!license || normalized === "UNKNOWN") return "UNKNOWN";

  if (normalized.includes("AGPL") || normalized.includes("SSPL") || isStandaloneGpl(normalized)) return "HIGH";
  if (normalized.includes("LGPL") || normalized.includes("MPL") || normalized.includes("CDDL") || normalized.includes("EPL")) return "MEDIUM";

  return "LOW";
}

function isStandaloneGpl(normalized: string) {
  return normalized === "GPL" || normalized.startsWith("GPL-") || normalized.includes(" GPL-") || normalized.includes("/GPL-");
}

function explainRisk(license: string, risk: LicenseRiskLevel) {
  if (risk === "HIGH") {
    return {
      reason: `${license} may impose strong copyleft or source distribution obligations depending on how the software is used or distributed.`,
      recommendation: "Replace the dependency, isolate it, or request a legal review before commercial launch."
    };
  }
  if (risk === "MEDIUM") {
    return {
      reason: `${license} may require attribution, file-level compliance, or special handling in distribution scenarios.`,
      recommendation: "Review notices, modifications, linking model, and distribution obligations."
    };
  }
  if (risk === "UNKNOWN") {
    return {
      reason: "The dependency license could not be identified from the local metadata sample.",
      recommendation: "Verify the package source, license file, and registry metadata before launch."
    };
  }
  return {
    reason: `${license} is generally permissive, but attribution and notice obligations may still apply.`,
    recommendation: "Keep copyright notices and attribution records."
  };
}

export function analyzePackageJson(input: PackageJsonLike): LicenseProbeResult {
  const dependencies = {
    ...(input.dependencies ?? {}),
    ...(input.devDependencies ?? {}),
    ...(input.optionalDependencies ?? {})
  };

  const findings: LicenseProbeFinding[] = Object.entries(dependencies).map(([packageName, versionRange]) => {
    const declaredLicense = sampleLicenseMap[packageName] ?? "UNKNOWN";
    const risk = classifyLicense(declaredLicense);
    const detail = explainRisk(declaredLicense, risk);

    return {
      packageName,
      versionRange,
      declaredLicense,
      risk,
      reason: detail.reason,
      recommendation: detail.recommendation
    };
  });

  return {
    projectName: input.name ?? "unknown-project",
    totalDependencies: findings.length,
    highRiskCount: findings.filter((item) => item.risk === "HIGH").length,
    mediumRiskCount: findings.filter((item) => item.risk === "MEDIUM").length,
    unknownCount: findings.filter((item) => item.risk === "UNKNOWN").length,
    findings
  };
}

export const airBoardPackageJson: PackageJsonLike = {
  name: "airboard",
  version: "0.1.0",
  license: "UNLICENSED",
  dependencies: {
    next: "latest",
    react: "latest",
    "react-dom": "latest",
    "whiteboard-core": "^2.4.1",
    "realtime-canvas-kit": "^0.8.2",
    "ai-board-templates": "^1.1.0",
    "canvas-exporter": "^3.2.0"
  },
  devDependencies: {
    typescript: "latest",
    eslint: "latest"
  }
};