import Link from "next/link";
import { getAirBoardAgentRun } from "@/lib/ip-agent/agent-run";

const riskClass = {
  LOW: "badge-green",
  MEDIUM: "badge-yellow",
  HIGH: "badge-red",
  UNKNOWN: "badge-blue"
};

export default function AgentRunPage() {
  const report = getAirBoardAgentRun();

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
            <Link href="/license">License probe</Link>
            <Link href="/probes">Paid probes</Link>
            <Link href="/report">Report</Link>
          </div>
        </nav>

        <section style={{ padding: "34px 0 22px" }}>
          <div className="kicker">Evidence-backed IP Agent</div>
          <h1 style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>Agent run: AirBoard IP risk review.</h1>
          <p className="lede">
            This page shows IP Breaker as an agentic workflow: extract IP risk surfaces, plan probe calls, normalize evidence, score launch risk, and generate a report without claiming to be a legal opinion.
          </p>
          <div className="actions">
            <Link className="btn btn-primary" href="/api/agent-run">Open agent JSON</Link>
            <Link className="btn btn-secondary" href="/probes">Open paid probe flow</Link>
          </div>
        </section>

        <section className="grid">
          <div className="panel card">
            <span className="badge badge-blue">Step 1</span>
            <h3 style={{ marginTop: 14 }}>Extract IP surfaces</h3>
            <p>The agent reads product metadata and separates code, name, UI, logo, and technical workflow risk surfaces.</p>
            <div className="hash">{report.surfaces.join(" · ")}</div>
          </div>

          <div className="panel card">
            <span className="badge badge-yellow">Step 2</span>
            <h3 style={{ marginTop: 14 }}>Plan probe sequence</h3>
            <p>The planner chooses evidence-producing probes instead of answering as a generic legal chatbot.</p>
            <div className="hash">{report.plan.length} probes selected</div>
          </div>

          <div className="panel card">
            <span className="badge badge-green">Step 3</span>
            <h3 style={{ marginTop: 14 }}>Write report</h3>
            <p>Probe outputs are normalized into a launch-risk score, verdict, evidence list, and human-review triggers.</p>
            <div className="hash">Score {report.riskScore} · {report.verdict}</div>
          </div>
        </section>

        <section className="form-wrap">
          <div className="panel card">
            <span className="badge badge-blue">Agent plan</span>
            <h3 style={{ marginTop: 14 }}>Planner → tool calls</h3>
            <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
              {report.plan.map((step) => (
                <div key={step.probeId} className="result-card">
                  <div className="result-title">
                    <strong>{step.order}. {step.title}</strong>
                    {step.paid ? <span className="badge badge-green">paid-capable</span> : <span className="badge badge-blue">probe</span>}
                  </div>
                  <p>{step.reason}</p>
                  <p className="hash">MCP tool: {step.mcpToolName}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel card">
            <span className="badge badge-red">Probe evidence</span>
            <h3 style={{ marginTop: 14 }}>Evidence-backed findings</h3>
            <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
              {report.results.map((result) => (
                <div key={result.probeId} className="result-card">
                  <div className="result-title">
                    <strong>{result.title}</strong>
                    <span className={`badge ${riskClass[result.riskLevel]}`}>{result.riskLevel}</span>
                  </div>
                  <p>{result.reasoning}</p>
                  <p><strong>Recommendation:</strong> {result.recommendation}</p>
                  {result.humanReviewTrigger ? <p><strong>Human review trigger:</strong> {result.humanReviewTrigger}</p> : null}
                  <details>
                    <summary>Evidence</summary>
                    <ul>
                      {result.evidence.map((item, index) => (
                        <li key={`${result.probeId}-${index}`}>
                          <strong>{item.source}</strong>{item.matchedField ? ` · ${item.matchedField}` : ""}: {item.snippet}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              ))}
            </div>
          </div>

          <div className="panel card">
            <span className="badge badge-green">Agent report</span>
            <h3 style={{ marginTop: 14 }}>Normalized output</h3>
            <pre className="code-block">{JSON.stringify(report, null, 2)}</pre>
          </div>
        </section>

        <div className="panel card" style={{ marginBottom: 40 }}>
          <span className="badge badge-yellow">Disclaimer</span>
          <p>{report.disclaimer}</p>
        </div>
      </div>
    </main>
  );
}
