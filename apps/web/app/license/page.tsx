import Link from "next/link";
import { airBoardPackageJson, analyzePackageJson } from "@/lib/license-probe";

function riskClass(risk: string) {
  if (risk === "HIGH") return "badge badge-red";
  if (risk === "MEDIUM") return "badge badge-yellow";
  if (risk === "UNKNOWN") return "badge badge-blue";
  return "badge badge-green";
}

export default function LicenseProbePage() {
  const result = analyzePackageJson(airBoardPackageJson);

  return (
    <main>
      <div className="container">
        <nav className="nav">
          <Link className="brand" href="/">
            <span className="brand-mark">IP</span>
            <span>IP Breaker</span>
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/probes">x402 probes</Link>
            <Link href="/report">Report</Link>
          </div>
        </nav>

        <section style={{ padding: "34px 0 22px" }}>
          <div className="kicker">Live Probe · License Contamination Attack</div>
          <h1 style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>Scan package metadata.</h1>
          <p className="lede">
            This page runs a real local license-risk classifier over the AirBoard sample package metadata. It flags copyleft, weak-copyleft, and unknown license signals for pre-launch review.
          </p>
        </section>

        <section className="report-header">
          <div className="panel card">
            <span className="badge badge-yellow">{result.projectName}</span>
            <h2 style={{ marginTop: 18 }}>Dependency License Summary</h2>
            <p>
              The MVP uses local package metadata and a sample license map. It is a triage probe, not a full SCA replacement.
            </p>
            <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", margin: "22px 0 0" }}>
              <div>
                <strong>Total</strong>
                <div className="score" style={{ fontSize: 38 }}>{result.totalDependencies}</div>
              </div>
              <div>
                <strong>High</strong>
                <div className="score" style={{ fontSize: 38 }}>{result.highRiskCount}</div>
              </div>
              <div>
                <strong>Medium</strong>
                <div className="score" style={{ fontSize: 38 }}>{result.mediumRiskCount}</div>
              </div>
              <div>
                <strong>Unknown</strong>
                <div className="score" style={{ fontSize: 38 }}>{result.unknownCount}</div>
              </div>
            </div>
          </div>

          <div className="panel score-box">
            <span className="badge badge-red">REVIEW</span>
            <p>High-risk dependency signals found before launch.</p>
            <Link className="btn btn-primary" href="/api/license-probe">Open API JSON</Link>
          </div>
        </section>

        <section className="risk-list">
          {result.findings.map((finding) => (
            <article className="panel risk-item" key={finding.packageName}>
              <div>
                <span className={riskClass(finding.risk)}>{finding.risk}</span>
                <p className="hash" style={{ marginTop: 12 }}>{finding.declaredLicense}</p>
              </div>
              <div>
                <h3>{finding.packageName}</h3>
                <p><strong>Version:</strong> {finding.versionRange}</p>
                <p><strong>Reason:</strong> {finding.reason}</p>
                <p><strong>Recommendation:</strong> {finding.recommendation}</p>
              </div>
            </article>
          ))}
        </section>

        <div className="actions" style={{ marginBottom: 40 }}>
          <Link className="btn btn-primary" href="/probes">Continue to x402 Probe Flow</Link>
          <Link className="btn btn-secondary" href="/report">Back to full report</Link>
        </div>
      </div>
    </main>
  );
}
