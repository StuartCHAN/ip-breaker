import Link from "next/link";

const playbooks = [
  "License Contamination Attack",
  "Trademark Collision Attack",
  "Design Lookalike Attack",
  "Patent Claim Trap Attack",
  "Code Clone Attack"
];

export default function HomePage() {
  return (
    <main>
      <div className="container">
        <nav className="nav">
          <Link className="brand" href="/">
            <span className="brand-mark">IP</span>
            <span>IP Breaker</span>
          </Link>
          <div className="nav-links">
            <Link href="/submit">Run demo scan</Link>
            <Link href="/license">License probe</Link>
            <Link href="/probes">x402 probes</Link>
            <Link href="/report">View report</Link>
            <a href="https://github.com/StuartCHAN/ip-breaker" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </nav>

        <section className="hero">
          <div>
            <div className="kicker">Agentic IP Firewall · Casper Buildathon MVP</div>
            <h1>Red-team your AI-built product before launch.</h1>
            <p className="lede">
              Vibe coding makes products faster. IP Breaker makes them safer to launch by scanning code, names, logos, UI patterns, and technical features for pre-launch IP risk signals.
            </p>
            <div className="actions">
              <Link className="btn btn-primary" href="/submit">Run IP Red-Team Scan</Link>
              <Link className="btn btn-secondary" href="/license">Try License Probe</Link>
              <Link className="btn btn-secondary" href="/probes">Demo x402 Probe Flow</Link>
            </div>
          </div>

          <div className="panel hero-card">
            <h3>Attack playbooks</h3>
            <p>Instead of acting like a legal chatbot, IP Breaker treats intellectual property risk as a launch attack surface.</p>
            {playbooks.map((item) => (
              <div className="scan-line" key={item}>
                <span className="dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid">
          <div className="panel card">
            <span className="badge badge-blue">Agentic AI</span>
            <h3 style={{ marginTop: 14 }}>IP red-team agent</h3>
            <p>The agent decomposes a submitted work into IP attack surfaces and chooses the right probes to run.</p>
          </div>
          <div className="panel card">
            <span className="badge badge-yellow">x402 / MCP</span>
            <h3 style={{ marginTop: 14 }}>Probe market</h3>
            <p>Specialized license, trademark, patent, and design probes can be exposed as paid agent tools.</p>
          </div>
          <div className="panel card">
            <span className="badge badge-green">Casper</span>
            <h3 style={{ marginTop: 14 }}>Risk attestation</h3>
            <p>Only report hashes and minimal risk metadata are anchored on Casper Testnet. Raw code stays off-chain.</p>
          </div>
        </section>

        <p className="footer-note">
          Disclaimer: IP Breaker provides pre-launch IP risk triage, not legal opinions or clearance advice.
        </p>
      </div>
    </main>
  );
}
