# Architecture

IP Breaker is built around five layers:

1. **Work Intake Layer**
   - Accepts GitHub repo URL, product name, logo, UI screenshot, product description, target market, and product category.
   - Computes a `work_hash` from submitted metadata and selected files.

2. **IP Red-Team Agent Layer**
   - Decomposes the submitted work into IP attack surfaces.
   - Plans which probes should be executed.
   - Explains findings in builder-friendly language.

3. **Probe Layer**
   - License Probe: scans package metadata and dependency licenses.
   - Trademark Probe: checks possible product name / logo collision risk.
   - Patent Probe: maps technical descriptions into claim-like feature clusters and searches for related references.
   - Design Probe: checks UI / visual similarity risk.
   - Code Clone Probe: checks suspected copied public code patterns.

4. **Paid Probe Verification Layer**
   - Returns HTTP 402 before paid probe access.
   - Accepts a Casper Testnet transaction hash as the probe receipt.
   - Verifies transaction success, transfer amount, recipient account, and block hash through Casper JSON-RPC.

5. **Casper Attestation Layer**
   - Stores report hashes and risk metadata on Casper Testnet.
   - Does not store source code, confidential product files, legal conclusions, or raw search results.

## High-level Flow

```text
Builder submits work
        |
        v
Create work hash
        |
        v
IP Red-Team Agent plans attack playbooks
        |
        v
Run free or paid probes
        |
        v
Verify Casper Testnet payment receipt for paid probes
        |
        v
Generate Launch Risk Report
        |
        v
Compute report hash
        |
        v
Write risk attestation to Casper Testnet
        |
        v
Display verified report status
```

## Casper Attestation Registry

The MVP registry stores:

```text
RiskAttestation {
  work_hash: String,
  report_hash: String,
  risk_score: u8,
  verdict: String,       // PASS / WARN / BLOCK
  issue_codes: Vec<String>,
  scanner_agent_id: String,
  created_at: u64
}
```

## x402-style Probe Market Concept

The implemented MVP flow is:

```text
Agent requests a specialized IP probe
        |
        v
Probe server returns HTTP 402 Payment Required
        |
        v
User or agent transfers CSPR on Casper Testnet
        |
        v
Backend verifies transaction hash, amount, recipient, and block hash
        |
        v
Probe returns scan result
        |
        v
Probe receipt hash is included in the final report path
```

## Privacy Principle

Only hashes and minimal risk metadata are written on-chain. Raw code, private screenshots, confidential product descriptions, and detailed search results remain off-chain.
