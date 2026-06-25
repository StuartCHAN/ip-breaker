# IP Breaker Web Demo

This is the clickable demo for IP Breaker.

## Pages

- `/` — landing page
- `/submit` — pre-filled AirBoard submission form
- `/report` — Launch Risk Report with Casper attestation status
- `/license` — real local License Contamination Probe demo
- `/probes` — x402-style paid probe flow with Casper Testnet transaction verification
- `/api/scan` — mock full scan API route
- `/api/license-probe` — package metadata license probe API route
- `/api/casper-payment` — Casper Testnet transaction-hash verification API route
- `/api/x402-probe` — paid probe API route returning HTTP 402 before payment verification

## Local Development

From the repository root:

```bash
npm install
npm run dev:web
```

Then open:

```text
http://localhost:3000
```

## Demo Flow

1. Open the landing page.
2. Click **Run IP Red-Team Scan**.
3. Review the pre-filled AirBoard submission.
4. Click **Run IP Red-Team Scan** again.
5. View the Launch Risk Report with mock Casper attestation hashes.
6. Open **License Probe** to see a real local package metadata risk classifier.
7. Open **x402 probes** to see HTTP 402, Casper Testnet transaction verification, and the paid probe result.

## API Checks

Open the local JSON endpoints:

```text
http://localhost:3000/api/license-probe
http://localhost:3000/api/casper-payment
http://localhost:3000/api/x402-probe
```

The paid probe endpoint returns HTTP 402 until the caller supplies a verified Casper Testnet transaction hash through the `x-casper-deploy-hash` header. The header name is kept for MVP compatibility, while the verifier accepts the current Casper Testnet transaction hash format.

## Current Status

This clickable MVP includes:

- Mock full IP red-team report
- Real local license-risk classifier over sample package metadata
- x402-style paid probe flow gated by Casper Testnet transaction verification
- Casper attestation status placeholder

Next steps:

- Add wallet-native Casper payment initiation inside the web app.
- Deploy a minimal Casper Testnet RiskAttestationRegistry.
- Replace mock Casper attestation metadata with a real testnet attestation transaction.
- Add repository-level scan ingestion for real GitHub projects.
