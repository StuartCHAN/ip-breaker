import { analyzePackageJson, airBoardPackageJson } from "@/lib/license-probe";
import type { AgentPlanStep, AgentReport, ProbeResult, RiskLevel, RiskSurface } from "@/lib/ip-agent/types";

const sampleProduct = {
  productName: "AirBoard",
  targetMarkets: ["US", "EU", "Global"],
  productCategory: "AI collaboration SaaS",
  repoUrl: "https://github.com/example/airboard-demo",
  uiDescription:
    "A dark SaaS dashboard with a left workspace rail, canvas collaboration area, board cards, AI summary panel, and real-time teammate presence indicators.",
  logoDescription: "A rounded cloud-board mark with blue gradient styling and the word AirBoard.",
  workflowSummary:
    "Teams create shared AI whiteboards, collaborate in real time, export boards, and ask an AI assistant to summarize decisions from board content.",
  featureList: [
    "real-time multi-user whiteboard collaboration",
    "AI-generated board summaries",
    "canvas export and template reuse",
    "workspace presence indicators",
    "SaaS dashboard onboarding flow"
  ]
};

export function getAirBoardAgentRun(): AgentReport {
  const surface = extractRiskSurface();
  const plan = planProbeSequence(surface);
  const results = runProbes(surface);
  const riskScore = scoreAgentRun(results);
  const verdict = riskScore >= 70 ? "MODIFY BEFORE LAUNCH" : riskScore >= 40 ? "WARN" : "PASS";

  return {
    agentRunId: "agent_run_airboard_001",
    product: surface.productName,
    surfaces: ["code dependencies", "product name", "UI / visual layout", "technical workflow"],
    plan,
    results,
    riskScore,
    verdict,
    reportHash: "sha256:agent-report-airboard-7f6e4c2b9d1a",
    disclaimer:
      "This is not a legal opinion, infringement opinion, clearance opinion, or formal freedom-to-operate opinion. It is an evidence-backed pre-launch IP risk triage generated for builder review."
  };
}

function extractRiskSurface(): RiskSurface {
  return {
    productName: sampleProduct.productName,
    targetMarkets: sampleProduct.targetMarkets,
    productCategory: sampleProduct.productCategory,
    repoSignals: {
      repoUrl: sampleProduct.repoUrl,
      packageJson: airBoardPackageJson,
      readmeText: "AirBoard is an AI whiteboard for teams with templates, real-time collaboration, and AI board summaries.",
      licenseFiles: ["package.json"]
    },
    visualSignals: {
      logoDescription: sampleProduct.logoDescription,
      uiDescription: sampleProduct.uiDescription
    },
    technicalSignals: {
      featureList: sampleProduct.featureList,
      workflowSummary: sampleProduct.workflowSummary
    }
  };
}

function planProbeSequence(surface: RiskSurface): AgentPlanStep[] {
  const plan: AgentPlanStep[] = [];

  if (surface.repoSignals.packageJson) {
    plan.push({
      order: plan.length + 1,
      probeId: "license-contamination-probe",
      title: "License Contamination Probe",
      reason: "Package metadata is available, so dependency license signals can be checked before launch.",
      paid: true,
      mcpToolName: "ip_breaker.license_contamination"
    });
  }

  if (surface.productName) {
    plan.push({
      order: plan.length + 1,
      probeId: "trademark-collision-probe",
      title: "Trademark Collision Probe",
      reason: "The product has a launch name and target markets, so the agent should generate name-risk signals and search keywords.",
      mcpToolName: "ip_breaker.trademark_collision"
    });
  }

  if (surface.visualSignals.uiDescription || surface.visualSignals.logoDescription) {
    plan.push({
      order: plan.length + 1,
      probeId: "design-lookalike-probe",
      title: "Design Lookalike Probe",
      reason: "The product includes UI and logo signals, so the agent should check visual-pattern risk before public launch.",
      mcpToolName: "ip_breaker.design_lookalike"
    });
  }

  if (surface.technicalSignals.featureList.length > 0) {
    plan.push({
      order: plan.length + 1,
      probeId: "patent-claim-trap-probe",
      title: "Patent Claim Trap Probe",
      reason: "The product description includes technical workflow features that can be converted into claim-like review clusters.",
      mcpToolName: "ip_breaker.patent_claim_trap"
    });
  }

  return plan;
}

function runProbes(surface: RiskSurface): ProbeResult[] {
  return [
    runLicenseProbe(surface),
    runTrademarkProbe(surface),
    runDesignProbe(surface),
    runPatentProbe(surface)
  ];
}

function runLicenseProbe(surface: RiskSurface): ProbeResult {
  const result = analyzePackageJson(airBoardPackageJson);
  const highOrUnknown = result.findings.filter((finding) => finding.risk === "HIGH" || finding.risk === "UNKNOWN");
  const riskLevel: RiskLevel = result.highRiskCount > 0 ? "HIGH" : result.unknownCount > 0 ? "UNKNOWN" : result.mediumRiskCount > 0 ? "MEDIUM" : "LOW";

  return {
    probeId: "license-contamination-probe",
    title: "License Contamination Probe",
    riskLevel,
    confidence: 0.86,
    evidence: highOrUnknown.slice(0, 4).map((finding) => ({
      source: "package.json dependency metadata",
      matchedField: finding.packageName,
      snippet: `${finding.packageName}@${finding.versionRange} declares ${finding.declaredLicense}`
    })),
    reasoning: `The local classifier reviewed ${result.totalDependencies} dependencies and found ${result.highRiskCount} high-risk license signals and ${result.unknownCount} unknown license signal.`,
    recommendation: "Replace, isolate, or review strong-copyleft and unknown dependencies before public launch or distribution.",
    humanReviewTrigger: "High-risk or unknown license findings should be reviewed before commercial launch."
  };
}

function runTrademarkProbe(surface: RiskSurface): ProbeResult {
  return {
    probeId: "trademark-collision-probe",
    title: "Trademark Collision Probe",
    riskLevel: "HIGH",
    confidence: 0.72,
    evidence: [
      {
        source: "product name and target-market metadata",
        matchedField: "productName",
        snippet: `${surface.productName} combines a short aviation/cloud-style prefix with a common collaboration-product noun.`
      },
      {
        source: "generated trademark search plan",
        matchedField: "searchQuery",
        snippet: "AirBoard; Air Board; AI whiteboard; collaboration SaaS; Nice classes 9 and 42"
      }
    ],
    reasoning:
      "The product name is short, brand-facing, and intended for software/SaaS markets. The agent treats this as a pre-launch name-collision signal rather than a clearance conclusion.",
    recommendation: "Run WIPO, USPTO, EUIPO, and target-country trademark searches; consider a more distinctive name before public launch.",
    humanReviewTrigger: "A launch name used in global SaaS markets should receive trademark clearance review before fundraising or public demo day."
  };
}

function runDesignProbe(surface: RiskSurface): ProbeResult {
  return {
    probeId: "design-lookalike-probe",
    title: "Design Lookalike Probe",
    riskLevel: "MEDIUM",
    confidence: 0.64,
    evidence: [
      {
        source: "UI screenshot description",
        matchedField: "uiDescription",
        snippet: surface.visualSignals.uiDescription
      },
      {
        source: "logo description",
        matchedField: "logoDescription",
        snippet: surface.visualSignals.logoDescription
      }
    ],
    reasoning:
      "The UI uses common collaboration-dashboard patterns: left navigation, board cards, presence indicators, and AI summary panels. This is not automatically infringing, but it is a visual-crowding signal for pre-launch redesign review.",
    recommendation: "Differentiate the layout, icon system, spacing, color palette, and onboarding flow; keep screenshots of original design decisions.",
    humanReviewTrigger: "If the UI was generated from prompts referencing existing products, perform a visual originality review."
  };
}

function runPatentProbe(surface: RiskSurface): ProbeResult {
  const featureList = surface.technicalSignals.featureList.join("; ");

  return {
    probeId: "patent-claim-trap-probe",
    title: "Patent Claim Trap Probe",
    riskLevel: "MEDIUM",
    confidence: 0.67,
    evidence: [
      {
        source: "technical workflow summary",
        matchedField: "workflowSummary",
        snippet: surface.technicalSignals.workflowSummary
      },
      {
        source: "extracted claim-like feature cluster",
        matchedField: "featureList",
        snippet: featureList
      },
      {
        source: "generated patent search plan",
        matchedField: "searchQuery",
        snippet: "real-time collaborative whiteboard AI summarization canvas export presence indicator"
      }
    ],
    reasoning:
      "The workflow contains claim-like combinations around collaborative canvas synchronization, AI summarization, templates, and export. The agent flags clusters for search planning, not infringement analysis.",
    recommendation: "Generate PATENTSCOPE / Google Patents search strings and request FTO review if these features are central to the commercial product.",
    humanReviewTrigger: "Patent/FTO review is recommended if the product will be commercialized in major software markets."
  };
}

function scoreAgentRun(results: ProbeResult[]) {
  const weights: Record<RiskLevel, number> = {
    LOW: 8,
    MEDIUM: 18,
    HIGH: 28,
    UNKNOWN: 16
  };

  const raw = results.reduce((sum, item) => sum + weights[item.riskLevel] * item.confidence, 0);
  return Math.min(100, Math.round(raw));
}
