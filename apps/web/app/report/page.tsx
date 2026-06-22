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
              The report hash and risk metadata are ready to be anchored on Casper Testnet. Raw source code, screenshots, and confidential product materials remain off-chain.
            </p>
            <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
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
            <span className="badge badge-blue">Next action</span>
            <h3 style={{ marginTop: 14 }}>Rename</h3>
            <p>Change AirBoard to a less collision-prone name such as AeroCanvas before public launch.</p>
          </div>
          <div className="panel card">
            <span className="badge badge-yellow">Next action</span>
            <h3 style={{ marginTop: 14 }}>Replace dependencies</h3>
            <p>Remove or isolate packages requiring deeper copyleft and attribution review.</p>
          </div>
          <div className="panel card">
            <span className="badge badge-green">Next action</span>
            <h3 style={{ marginTop: 14 }}>Request FTO review</h3>
            <p>Ask qualified IP counsel to review high-value technical workflows before commercial launch.</p>
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
