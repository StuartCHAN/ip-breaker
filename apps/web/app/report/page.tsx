import Link from "next/link";
import { mockReport } from "@/lib/mock-scan";

function severityClass(severity: string) {
  if (severity === "HIGH") return "badge badge-red";
  if (severity === "MEDIUM") return "badge badge-yellow";
  return "badge badge-green";
}

export default function ReportPage() {
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
            <Link href="/submit">Run again</Link>
            <Link href="/license">License probe</Link>
            <Link href="/probes">x402 probes</Link>
            <a href="https://github.com/StuartCHAN/ip-breaker" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </nav>

        <section style={{ padding: "34px 0 22px" }}>
          <div className="kicker">Launch Risk Report · AirBoard</div>
          <h1 style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>Modify before launch.</h1>
          <p className="lede">
            IP Breaker found multiple pre-launch IP risk signals. This is a red-team triage report, not a legal opinion.
          </p>
        </section>

        <section className="report-header">
          <div className="panel card">
            <span className="badge badge-red">{mockReport.verdict}</span>
            <h2 style={{ marginTop: 18 }}>Launch Risk Attestation</h2>
            <p>
              The report hash and risk metadata are staged for Casper Testnet attestation. The MVP currently displays mock deploy data; the next build step is replacing it with a real Casper Testnet transaction.
            </p>
            <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
              <div>
                <strong>Attestation status</strong>
                <div className="hash">MOCK_READY_FOR_TESTNET_DEPLOY</div>
              </div>
              <div>
                <strong>Work hash</strong>
                <div className="hash">{mockReport.workHash}</div>
              </div>
              <div>
                <strong>Report hash</strong>
                <div className="hash">{mockReport.reportHash}</div>
              </div>
              <div>
                <strong>Casper deploy</strong>
                <div className="hash">{mockReport.casperTx}</div>
              </div>
            </div>
          </div>

          <div className="panel score-box">
            <div className="score">{mockReport.riskScore}</div>
            <p style={{ margin: 0 }}>Launch Risk Score</p>
            <span className="badge badge-red" style={{ marginTop: 12 }}>BLOCK</span>
          </div>
        </section>

        <section className="risk-list">
          {mockReport.findings.map((finding) => (
            <article className="panel risk-item" key={finding.id}>
              <div>
                <span className={severityClass(finding.severity)}>{finding.severity}</span>
                <p className="hash" style={{ marginTop: 12 }}>{finding.id}</p>
              </div>
              <div>
                <h3>{finding.title}</h3>
                <p><strong>Playbook:</strong> {finding.playbook}</p>
                <p>{finding.summary}</p>
                <p><strong>Evidence:</strong> {finding.evidence}</p>
                <p><strong>Recommendation:</strong> {finding.recommendation}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="grid">
          <div className="panel card">
            <span className="badge badge-blue">Live module</span>
            <h3 style={{ marginTop: 14 }}>License Probe</h3>
            <p>Open the package metadata probe to see a real local scan for copyleft and unknown license signals.</p>
            <Link className="btn btn-secondary" href="/license">Open License Probe</Link>
          </div>
          <div className="panel card">
            <span className="badge badge-yellow">Live module</span>
            <h3 style={{ marginTop: 14 }}>x402 Probe Flow</h3>
            <p>Show the unpaid 402 response and paid retry flow for a specialized IP probe.</p>
            <Link className="btn btn-secondary" href="/probes">Open x402 Flow</Link>
          </div>
          <div className="panel card">
            <span className="badge badge-green">Next action</span>
            <h3 style={{ marginTop: 14 }}>Casper Testnet</h3>
            <p>Replace the mock deploy hash with a real RiskAttestationRegistry transaction.</p>
          </div>
        </section>

        <div className="actions" style={{ marginBottom: 40 }}>
          <Link className="btn btn-primary" href="/submit">Run fixed-product rescan</Link>
          <Link className="btn btn-secondary" href="/">Back to home</Link>
        </div>
      </div>
    </main>
  );
}
