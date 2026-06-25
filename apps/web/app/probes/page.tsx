"use client";

import Link from "next/link";
import { useState } from "react";

type ProbeState = {
  status: number;
  body: unknown;
};

export default function ProbeMarketPage() {
  const [firstResponse, setFirstResponse] = useState<ProbeState | null>(null);
  const [verificationResponse, setVerificationResponse] = useState<ProbeState | null>(null);
  const [paidResponse, setPaidResponse] = useState<ProbeState | null>(null);
  const [deployHash, setDeployHash] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestWithoutPayment() {
    setLoading(true);
    const response = await fetch("/api/x402-probe");
    const body = await response.json();
    setFirstResponse({ status: response.status, body });
    setLoading(false);
  }

  async function verifyPaymentAndRequestProbe() {
    setLoading(true);

    const verification = await fetch("/api/casper-payment", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ deployHash })
    });
    const verificationBody = await verification.json();
    setVerificationResponse({ status: verification.status, body: verificationBody });

    if (verification.ok && verificationBody.ok) {
      const response = await fetch("/api/x402-probe", {
        headers: {
          "x-casper-deploy-hash": deployHash
        }
      });
      const body = await response.json();
      setPaidResponse({ status: response.status, body });
    } else {
      setPaidResponse(null);
    }

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
          <div className="kicker">Casper Testnet · Paid Probe Market</div>
          <h1 style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>Pay per IP probe.</h1>
          <p className="lede">
            This page upgrades the earlier mock x402-style flow into a Casper Testnet payment-verification flow: the probe first returns HTTP 402, then unlocks only after a Casper deploy hash is verified by the backend.
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
            <h3 style={{ marginTop: 14 }}>Pay on Casper Testnet</h3>
            <p>Transfer the quoted amount to the configured probe provider account, then paste the Casper deploy hash below.</p>
            <p className="hash">Amount: 0.10 CSPR</p>
            <p className="hash">Network: casper-testnet</p>
          </div>

          <div className="panel card">
            <span className="badge badge-green">Step 3</span>
            <h3 style={{ marginTop: 14 }}>Verify and unlock</h3>
            <p>The backend verifies the deploy through Casper JSON-RPC before returning the paid probe result.</p>
            <button className="btn btn-primary" onClick={verifyPaymentAndRequestProbe} disabled={loading || !deployHash.trim()}>
              Verify Casper payment + run probe
            </button>
          </div>
        </section>

        <section className="form-wrap">
          <div className="panel card">
            <span className="badge badge-red">Unpaid response</span>
            <h3 style={{ marginTop: 14 }}>402 response payload</h3>
            <pre className="code-block">
              {firstResponse ? JSON.stringify(firstResponse, null, 2) : "Click 'Request without payment' to see the 402 payment requirements."}
            </pre>
          </div>

          <div className="panel form">
            <span className="badge badge-blue">Casper receipt</span>
            <h3 style={{ marginTop: 14 }}>Submit deploy hash</h3>
            <p>
              For production, set <code>CASPER_PAYMENT_ACCOUNT_HASH</code> in Vercel so the verifier can check the exact recipient account.
            </p>
            <div className="field">
              <label>Casper Testnet deploy hash</label>
              <input
                placeholder="Paste Casper deploy hash after payment"
                value={deployHash}
                onChange={(event) => setDeployHash(event.target.value)}
              />
            </div>
            <pre className="code-block">
              {verificationResponse
                ? JSON.stringify(verificationResponse, null, 2)
                : "After payment, paste the deploy hash and click the verification button."}
            </pre>
          </div>

          <div className="panel card">
            <span className="badge badge-green">Paid response</span>
            <h3 style={{ marginTop: 14 }}>Probe result payload</h3>
            <pre className="code-block">
              {paidResponse ? JSON.stringify(paidResponse, null, 2) : "A verified Casper deploy hash is required before the paid probe result is returned."}
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
