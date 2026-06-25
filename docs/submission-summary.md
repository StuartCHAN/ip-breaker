# IP Breaker — Buildathon Submission Summary

## One-line Summary

**IP Breaker is an agentic IP firewall for vibe-coded products: before an AI-built product goes live, an IP agent reviews its code dependencies, product name, UI patterns, technical workflow, and launch artifacts for early intellectual property risk signals.**

## Live Links

- **Live demo:** https://ip-breaker-web.vercel.app/
- **Demo video:** https://www.youtube.com/watch?v=ea7GjoQM6Ig
- **DoraHacks BUIDL:** https://dorahacks.io/buidl/45903
- **GitHub repository:** https://github.com/StuartCHAN/ip-breaker

## Built For

**Casper Agentic Buildathon 2026 Qualification Round**

IP Breaker is built for the agent economy, where AI agents can inspect builder outputs, call specialized risk probes, pay for probe results, and anchor tamper-evident records on-chain.

## Problem

Vibe coding makes it easy to build products quickly, but speed also creates a new launch risk surface.

AI-built products may include:

- dependency license obligations that the founder did not notice;
- copied or public-code-like implementation patterns;
- product names, logos, or slogans that may collide with existing brands;
- UI or visual designs that resemble existing products;
- technical workflows that may require patent or freedom-to-operate review.

Most early builders do not run even a basic IP risk review before launch, fundraising, or public demo day.

## Solution

IP Breaker treats IP risk as a pre-launch risk surface.

A builder submits a GitHub repo, product name, target market, UI screenshot or logo, and technical description. IP Breaker then acts as an IP red-team agent and runs several review playbooks:

1. **License Contamination Attack** — checks package metadata and flags license risk signals.
2. **Trademark Collision Attack** — reviews product names, slogans, and brand-like elements.
3. **Design Lookalike Attack** — reviews UI and visual similarity risk signals.
4. **Patent Claim Trap Attack** — breaks technical descriptions into features that may require FTO review.
5. **Code Clone Attack** — planned module for copied-code or public-code similarity signals.

The output is a **Launch Risk Report** with:

- Launch Risk Score;
- verdict such as `MODIFY BEFORE LAUNCH`;
- concrete findings;
- recommended actions;
- report hash and work hash prepared for Casper-oriented attestation.

## What Is Working in the MVP

The current clickable MVP includes:

- a public Vercel deployment;
- a product submission flow using the fictional AI whiteboard product **AirBoard**;
- a Launch Risk Report showing risk score, verdict, findings, and recommendations;
- a working local **License Contamination Probe**;
- a mock **x402-style paid probe flow**;
- a Casper Testnet attestation placeholder showing work hash, report hash, and deploy metadata.

## Demo Walkthrough

The demo uses **AirBoard**, a fictional vibe-coded AI whiteboard collaboration product.

The demo flow shows:

1. the builder submits the product for review;
2. IP Breaker generates a Launch Risk Report;
3. the report flags possible trademark, license, UI, and patent/FTO risk signals;
4. the License Probe classifies dependency license risks;
5. the x402-style probe flow first returns HTTP 402 and then returns results after a mock payment retry;
6. the report displays a Casper-oriented attestation area where only hashes and minimal metadata are intended to be anchored on-chain.

## Agent Economy Fit

IP Breaker is not a conventional legal SaaS form.

It is designed around an agent workflow:

- the builder submits product artifacts;
- the IP agent decomposes the product into review surfaces;
- specialized probes are called as tools;
- paid probes can be exposed through an x402-style payment flow;
- probe receipts and report hashes can be included in the final launch-risk record.

This makes IP Breaker compatible with a future market of specialized agent-callable IP risk probes.

## Casper Fit

Casper is used as the trust layer for launch-risk attestations.

The intended Casper attestation model stores only minimal metadata:

```text
work_hash
report_hash
risk_score
verdict
issue_codes
scanner_agent_id
created_at
```

Raw source code, screenshots, product files, private documents, and legal conclusions are kept off-chain.

This creates a tamper-evident record that a given product artifact and report existed at a point in time, without leaking sensitive builder information.

## Why This Matters

AI reduces the cost of building products. It does not eliminate IP risk.

As more products are vibe-coded, founders will need lightweight, automated, pre-launch review layers before they ship, raise money, or publish demos. IP Breaker addresses that gap by turning IP review into an agent-native, probe-based, and attestation-ready workflow.

## Current Limitations

This MVP is intentionally scoped for a buildathon demo:

- trademark, design, patent, and code-clone probes are represented as structured mock or planned modules;
- the license probe is the main working local classifier;
- the x402 flow is a mock implementation showing the intended interaction pattern;
- the Casper deploy hash is currently a placeholder rather than a live testnet transaction.

## Next Steps

- Connect live trademark, patent, and design search APIs or datasets.
- Add MCP wrappers for specialized IP probes.
- Replace the mock x402 flow with a live compatible payment flow.
- Deploy a minimal Casper Testnet attestation registry.
- Replace the placeholder deploy hash with a real Casper Testnet transaction.
- Add support for real GitHub repository ingestion and report export.

## Disclaimer

IP Breaker does **not** provide legal opinions, legal advice, infringement opinions, validity opinions, clearance opinions, or formal freedom-to-operate opinions.

It performs pre-launch IP risk triage and red-team style review. High-risk findings should be reviewed by qualified intellectual property counsel before launch, fundraising, investment, or commercial deployment.
