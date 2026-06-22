# IP Breaker Web Demo

This is the first clickable demo for IP Breaker.

## Pages

- `/` — landing page
- `/submit` — pre-filled AirBoard submission form
- `/report` — mock Launch Risk Report
- `/api/scan` — mock scan API route

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

## Current Status

This is a clickable MVP shell. The scan output is mocked so the demo can be recorded quickly. Next steps:

- Add real license probe for package metadata.
- Add x402-style paid probe flow.
- Add Casper Testnet attestation transaction.
- Replace mock Casper deploy link with a real testnet transaction.
