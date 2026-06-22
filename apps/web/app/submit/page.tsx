import Link from "next/link";
import { demoSubmission } from "@/lib/mock-scan";

export default function SubmitPage() {
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
            <Link href="/report">Sample report</Link>
          </div>
        </nav>

        <section style={{ padding: "36px 0 28px" }}>
          <div className="kicker">Demo intake · AirBoard sample</div>
          <h1 style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>Submit a vibe-coded work.</h1>
          <p className="lede">
            For the first clickable demo, this form is pre-filled with a fictional AI whiteboard product. Click the scan button to generate a pre-launch IP red-team report.
          </p>
        </section>

        <section className="form-wrap">
          <div className="panel form">
            <div className="field">
              <label>GitHub repo URL</label>
              <input defaultValue={demoSubmission.githubRepo} />
            </div>
            <div className="field">
              <label>Product name</label>
              <input defaultValue={demoSubmission.productName} />
            </div>
            <div className="field">
              <label>Product category</label>
              <select defaultValue={demoSubmission.category}>
                <option>AI collaboration SaaS</option>
                <option>Web3 developer tool</option>
                <option>Consumer AI app</option>
                <option>Fintech / payments</option>
              </select>
            </div>
            <div className="field">
              <label>Target market</label>
              <input defaultValue={demoSubmission.targetMarket} />
            </div>
            <div className="field">
              <label>Logo / UI screenshot</label>
              <input defaultValue="airboard-dashboard-sample.png" />
            </div>
            <div className="field">
              <label>Technical description</label>
              <textarea defaultValue={demoSubmission.description} />
            </div>
            <div className="actions">
              <Link className="btn btn-primary" href="/report">Run IP Red-Team Scan</Link>
              <Link className="btn btn-secondary" href="/">Cancel</Link>
            </div>
          </div>

          <aside className="panel card">
            <span className="badge badge-blue">What the agent will do</span>
            <h3 style={{ marginTop: 14 }}>Build an IP attack surface</h3>
            <p>The demo agent will inspect five risk surfaces before launch:</p>
            <div className="scan-line"><span className="dot" />Source code and dependencies</div>
            <div className="scan-line"><span className="dot" />Product name and slogan</div>
            <div className="scan-line"><span className="dot" />Logo and visual identity</div>
            <div className="scan-line"><span className="dot" />UI layout and design patterns</div>
            <div className="scan-line"><span className="dot" />Technical workflow and features</div>
          </aside>
        </section>
      </div>
    </main>
  );
}
