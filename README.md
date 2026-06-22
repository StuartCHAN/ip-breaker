# IP Breaker

**Agentic IP Firewall for Vibe-Coded Products**

> Before your AI-built product goes live, let an IP agent attack it first.

## Problem

Vibe coding tools make it possible to build and launch products in hours. However, many AI-built products are shipped without checking whether the generated work creates intellectual property risk.

A product may include license-contaminated code, copied code patterns, confusingly similar names or logos, UI/design lookalikes, or technical features that require patent/FTO review before public launch.

IP Breaker treats intellectual property risk as a pre-launch attack surface.

## Solution

IP Breaker is a red-team agent for AI-built products. A builder submits a GitHub repo, product name, logo, UI screenshot, and technical description. The agent decomposes the work into IP attack surfaces and runs multiple playbooks:

- License Contamination Attack
- Code Clone Attack
- Trademark Collision Attack
- Design Lookalike Attack
- Patent Claim Trap Attack

The system generates a Launch Risk Score, explains detected risks, recommends fixes, and anchors a tamper-evident risk attestation on Casper Testnet without exposing proprietary source code.

## Why Casper

IP Breaker is designed for the agent economy.

- AI agents use MCP-style tools to call specialized IP risk probes.
- x402-style paid probes allow agents to pay per scan or per data source.
- Casper Testnet stores launch-risk attestations, report hashes, issue codes, and scanner agent identity.
- Only hashes and risk metadata are written on-chain. Raw source code, product files, and business secrets are not stored on-chain.

## MVP Demo

The demo uses a fictional vibe-coded product called **AirBoard**, an AI whiteboard collaboration app.

The founder wants to launch AirBoard publicly. IP Breaker scans the repo, product name, UI screenshot, logo, and technical description. The agent detects several risks:

- A possible trademark collision in SaaS/software categories
- A UI lookalike risk against known collaboration tools
- A copyleft license issue in the dependency chain
- Patent claim trap clusters that require FTO review

After fixes, the founder renames the product, updates the UI, replaces risky dependencies, and generates a new Casper risk attestation.

## Architecture

```text
User Work Submission
        |
        v
IP Red-Team Agent
        |
        +--> License Probe
        +--> Trademark Probe
        +--> Patent Probe
        +--> Design Probe
        +--> Code Clone Probe
        |
        v
Launch Risk Report
        |
        v
Casper Risk Attestation Registry
```

## On-chain Attestation

The Casper Testnet component stores:

```text
work_hash
report_hash
risk_score
verdict
issue_codes
scanner_agent_id
created_at
```

The registry does not store raw source code, private files, or legal conclusions.

## Disclaimer

IP Breaker does not provide legal opinions. It performs pre-launch IP risk triage and red-team analysis. High-risk findings should be reviewed by qualified IP counsel before launch, investment, or commercial deployment.

## Status

This project is being built for the Casper Agentic Buildathon 2026 Qualification Round.

## Roadmap

- [ ] Build landing page and submission form
- [ ] Implement license probe for package files
- [ ] Implement mock trademark and patent probes
- [ ] Implement IP red-team agent workflow
- [ ] Generate Launch Risk Score
- [ ] Deploy Casper Testnet attestation registry
- [ ] Record scan report hash on Casper Testnet
- [ ] Publish demo video
