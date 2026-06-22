export type RiskSeverity = "HIGH" | "MEDIUM" | "LOW";

export type RiskFinding = {
  id: string;
  title: string;
  severity: RiskSeverity;
  playbook: string;
  summary: string;
  evidence: string;
  recommendation: string;
};

export const demoSubmission = {
  productName: "AirBoard",
  category: "AI collaboration SaaS",
  targetMarket: "US / EU / Global",
  githubRepo: "https://github.com/demo/airboard",
  description:
    "AirBoard is a vibe-coded AI whiteboard app for teams. It supports real-time collaboration, board summaries, template generation, and automated meeting-to-board workflows."
};

export const mockFindings: RiskFinding[] = [
  {
    id: "TM-001",
    title: "Possible product name collision",
    severity: "HIGH",
    playbook: "Trademark Collision Attack",
    summary:
      "The name AirBoard may be too close to existing marks or product names in software, collaboration, or whiteboard-related categories.",
    evidence:
      "The agent found name similarity signals across SaaS and productivity categories. This is a pre-launch risk signal, not a legal conclusion.",
    recommendation:
      "Rename before public launch or request a trademark clearance review in target jurisdictions. Suggested safer working name: AeroCanvas."
  },
  {
    id: "LIC-002",
    title: "Copyleft dependency review required",
    severity: "MEDIUM",
    playbook: "License Contamination Attack",
    summary:
      "One dependency chain contains packages that may require attribution or license review before distribution.",
    evidence:
      "The mock package scan flagged GPL/AGPL-style obligations in a transitive dependency group.",
    recommendation:
      "Replace the dependency, isolate it, or complete a license compliance review before shipping."
  },
  {
    id: "DSN-003",
    title: "UI lookalike pattern detected",
    severity: "MEDIUM",
    playbook: "Design Lookalike Attack",
    summary:
      "The dashboard and board layout visually resemble common collaboration/whiteboard product patterns.",
    evidence:
      "The agent detected similar sidebar, canvas, and floating-toolbar compositions in the sample UI screenshot.",
    recommendation:
      "Change visual hierarchy, iconography, color system, and interaction patterns to reduce lookalike risk."
  },
  {
    id: "PAT-004",
    title: "Patent claim trap clusters found",
    severity: "LOW",
    playbook: "Patent Claim Trap Attack",
    summary:
      "The technical description includes real-time collaboration, AI board summarization, and meeting-to-board workflow features that may require FTO review.",
    evidence:
      "The agent mapped the product description into claim-like feature clusters and found related search clusters.",
    recommendation:
      "Ask qualified IP counsel to review freedom-to-operate before commercial launch or fundraising."
  }
];

export const mockReport = {
  workHash: "0x7ac1c1e3fbd3a6d78c9a4e183cbb2c3c8b8cf0f224ef1bd6d9f6c84e9a7b0012",
  reportHash: "0x9f2c48c4410dc9aa390294a4477a815aee07cfb392ea418ef72b0df44f951923",
  scannerAgentId: "ip-breaker-agent-alpha",
  riskScore: 78,
  verdict: "MODIFY BEFORE LAUNCH",
  issueCodes: ["TM-001", "LIC-002", "DSN-003", "PAT-004"],
  casperTx: "casper-testnet://deploy/0xmocked-attestation-deploy-hash",
  createdAt: "2026-06-22T00:00:00.000Z",
  findings: mockFindings
};
