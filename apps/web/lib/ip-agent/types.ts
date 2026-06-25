export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";

export type RiskSurface = {
  productName: string;
  targetMarkets: string[];
  productCategory: string;
  repoSignals: {
    repoUrl?: string;
    packageJson?: unknown;
    readmeText?: string;
    licenseFiles?: string[];
  };
  visualSignals: {
    logoDescription?: string;
    uiDescription?: string;
  };
  technicalSignals: {
    featureList: string[];
    workflowSummary: string;
  };
};

export type AgentPlanStep = {
  order: number;
  probeId: string;
  title: string;
  reason: string;
  paid?: boolean;
  mcpToolName?: string;
};

export type ProbeEvidence = {
  source: string;
  snippet?: string;
  url?: string;
  matchedField?: string;
};

export type ProbeResult = {
  probeId: string;
  title: string;
  riskLevel: RiskLevel;
  confidence: number;
  evidence: ProbeEvidence[];
  reasoning: string;
  recommendation: string;
  humanReviewTrigger?: string;
};

export type AgentReport = {
  agentRunId: string;
  product: string;
  surfaces: string[];
  plan: AgentPlanStep[];
  results: ProbeResult[];
  riskScore: number;
  verdict: "PASS" | "WARN" | "MODIFY BEFORE LAUNCH";
  reportHash: string;
  disclaimer: string;
};
