# Casper Testnet Payment Verification Flow

This document describes the upgraded paid-probe flow used by IP Breaker.

## Goal

The earlier demo used a mock payment header to simulate an x402-style paid probe. The upgraded implementation keeps the HTTP 402 pattern, but replaces the mock unlock condition with a Casper Testnet deploy-hash verification step.

The goal is to demonstrate that a specialized IP probe can return results only after the backend verifies an on-chain Casper payment receipt.

## Flow

1. The agent requests the paid License Contamination Probe at `/api/x402-probe`.
2. The API returns `HTTP 402 Payment Required` with Casper Testnet payment requirements.
3. The user or agent transfers the quoted CSPR amount to the configured probe provider account.
4. The user or agent pastes the Casper Testnet deploy hash into `/probes`.
5. The frontend sends the deploy hash to `/api/casper-payment`.
6. The backend calls Casper JSON-RPC `info_get_deploy`.
7. The verifier checks:
   - deploy execution success;
   - transfer amount is at least the required amount;
   - transfer target matches the configured recipient account.
8. If verified, `/api/x402-probe` returns the paid probe result.

## API Routes

- `GET /api/x402-probe` without payment returns HTTP 402.
- `GET /api/x402-probe` with `x-casper-deploy-hash` verifies payment and returns the paid result.
- `GET /api/casper-payment` returns the current payment requirements.
- `POST /api/casper-payment` verifies a submitted deploy hash.

Example verification request:

```bash
curl -X POST https://ip-breaker-web.vercel.app/api/casper-payment \
  -H "content-type: application/json" \
  -d '{"deployHash":"<CASPER_TESTNET_DEPLOY_HASH>"}'
```

Example paid probe request:

```bash
curl https://ip-breaker-web.vercel.app/api/x402-probe \
  -H "x-casper-deploy-hash: <CASPER_TESTNET_DEPLOY_HASH>"
```

## Environment Variables

Production verification requires a configured recipient account:

```bash
CASPER_PAYMENT_ACCOUNT_HASH=account-hash-...
CASPER_PAYMENT_AMOUNT_CSPR=0.10
CASPER_RPC_URL=https://node.testnet.casper.network/rpc
CASPER_PAYMENT_NETWORK=casper-testnet
```

If `CASPER_PAYMENT_ACCOUNT_HASH` is not configured, the verifier will intentionally refuse to unlock the paid probe because it cannot know which recipient account should receive payment.

## Current Scope

This is not a wallet-native checkout yet. It is a manual deploy-hash verification flow:

- the user or agent performs the Casper Testnet transfer externally;
- the IP Breaker backend verifies the submitted deploy hash;
- the probe result is returned only after verification.

This is enough to demonstrate a real blockchain-backed payment receipt gate for the buildathon MVP. A future version can add wallet connection and payment initiation directly inside the web app.
