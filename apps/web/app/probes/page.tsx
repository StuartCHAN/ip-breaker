"use client";

import Link from "next/link";
import { useState } from "react";

type ProbeState = {
  status: number;
  body: unknown;
};

export default function ProbeMarketPage() {
  const [firstResponse, setFirstResponse] = useState<ProbeState | null>(null);
  const [paidResponse, setPaidResponse] = useState<ProbeState | null>(null);
  const [loading, setLoading] = useState(false);

  async function requestWithoutPayment() {
    setLoading(true);
    const response = await fetch("/api/x402-probe");
    const body = await response.json();
    setFirstResponse({ status: response.status, body });
    setLoading(false);
  }

  async function requestWithPayment() {
    setLoading(true);
    const response = await fetch("/api/x402-probe", {
      headers: {
        "x-mock-payment": "paid"
      }
    });
    const body = await response.json();
    setPaidResponse({ status: response.status, body });
    setLoading(false);
  }

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
            <Link href="/report">Report</Link>
          </div>
        </nav>

        <section style={{ padding: "34px 0 22px" }}>
          <div className="kicker">Mock x402 · Paid Probe Market</div>
          <h1 style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>Pay per IP probe.</h1>
          <p className="lede">
            This page demonstrates the intended x402-style flow: the agent requests a specialized probe, receives HTTP 402 Payment Required, then retries with a payment proof and receives the scan result.
          </p>
        </section>

        <section className="grid">
          <div className="panel card">
            <span className="badge badge-blue">Step 1</span>
            <h3 style={{ marginTop: 14 }}>Request probe</h3>
            <p>The agent requests the License Contamination Probe without payment.</p>
            <button className="btn btn-secondary" onClick={requestWithoutPayment} disabled={loading}>
              Request without payment
            </button>
          </div>

          <div className="panel card">
            <span className="badge badge-yellow">Step 2</span>
            <h3 style={{ marginTop: 14 }}>Receive 402</h3>
            <p>The probe server returns payment requirements instead of scan data.</p>
            <p className="hash">HTTP 402 Payment Required</p>
          </div>

          <div className="panel card">
            <span className="badge badge-green">Step 3</span>
            <h3 style={{ marginTop: 14 }}>Retry with payment</h3>
            <p>The agent retries with a mock payment header and receives the probe result.</p>
            <button className="btn btn-primary" onClick={requestWithPayment} disabled={loading}>
              Retry with mock payment
            </button>
          </div>
        </section>

        <section className="form-wrap">
          <div className="panel card">
            <span className="badge badge-red">Unpaid response</span>
            <h3 style={{ marginTop: 14 }}>402 response payload</h3>
            <pre className="code-block">
              {firstResponse ? JSON.stringify(firstResponse, null, 2) : "Click 'Request without payment' to see the 402 payload."}
            </pre>
          </div>

          <div className="panel card">
            <span className="badge badge-green">Paid response</span>
            <h3 style={{ marginTop: 14 }}>Probe result payload</h3>
            <pre className="code-block">
              {paidResponse ? JSON.stringify(paidResponse, null, 2) : "Click 'Retry with mock payment' to see the paid probe result."}
            </pre>
          </div>
        </section>

        <div className="actions" style={{ marginBottom: 40 }}>
          <Link className="btn btn-primary" href="/report">Back to Launch Risk Report</Link>
          <Link className="btn btn-secondary" href="/license">View License Probe</Link>
        </div>
      </div>
    </main>
  );
}
