# IP Breaker Web Demo

This is the first clickable demo for IP Breaker.

## Pages

- `/` — landing page
- `/submit` — pre-filled AirBoard submission form
- `/report` — Launch Risk Report with Casper attestation status
- `/license` — real local License Contamination Probe demo
- `/probes` — mock x402 paid probe flow demo
- `/api/scan` — mock full scan API route
- `/api/license-probe` — package metadata license probe API route
- `/api/x402-probe` — mock x402-style paid probe API route

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
7. Open **x402 probes** to see the mock HTTP 402 Payment Required flow.

## API Checks

Open the local JSON endpoints:

```text
http://localhost:3000/api/license-probe
http://localhost:3000/api/x402-probe
```

The x402 demo endpoint returns HTTP 402 unless called with:

```text
x-mock-payment: paid
```

## Current Status

This is a clickable MVP shell. It now includes:

- Mock full IP red-team report
- Real local license-risk classifier over sample package metadata
- Mock x402-style paid probe flow
- Casper attestation status placeholder

Next steps:

- Replace mock x402 payment with a real x402-compatible flow if time permits.
- Deploy a minimal Casper Testnet RiskAttestationRegistry.
- Replace mock Casper deploy link with a real testnet transaction.
- Add screenshots and a recorded demo video.
