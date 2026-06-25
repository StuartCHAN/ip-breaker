import { airBoardPackageJson, analyzePackageJson } from "@/lib/license-probe";

const MOTES_PER_CSPR = 1_000_000_000n;

export const casperPaymentConfig = {
  network: process.env.CASPER_PAYMENT_NETWORK ?? "casper-testnet",
  rpcUrl: process.env.CASPER_RPC_URL ?? "https://node.testnet.casper.network/rpc",
  amountCSPR: process.env.CASPER_PAYMENT_AMOUNT_CSPR ?? "0.10",
  payTo: process.env.CASPER_PAYMENT_ACCOUNT_HASH ?? "",
  resource: "/api/x402-probe",
  probeId: "license-contamination-probe",
  description: "License Contamination Probe for AirBoard sample package metadata"
};

export type CasperPaymentVerification = {
  ok: boolean;
  status: string;
  message: string;
  deployHash?: string;
  required: ReturnType<typeof getCasperPaymentRequirements>;
  observed?: {
    success?: boolean;
    amountMotes?: string;
    amountCSPR?: string;
    target?: string;
    deployAccount?: string;
    blockHash?: string;
    rpcMethod?: string;
  };
  error?: unknown;
};

export function getCasperPaymentRequirements() {
  return {
    x402Version: "casper-manual-0.1",
    accepts: [
      {
        scheme: "casper-testnet-transfer",
        network: casperPaymentConfig.network,
        maxAmountRequired: casperPaymentConfig.amountCSPR,
        payTo: casperPaymentConfig.payTo || "CONFIGURE_CASPER_PAYMENT_ACCOUNT_HASH",
        asset: "CSPR",
        resource: casperPaymentConfig.resource,
        description: casperPaymentConfig.description,
        verification: {
          method: "Casper JSON-RPC info_get_transaction, with info_get_deploy fallback",
          rpcUrl: casperPaymentConfig.rpcUrl,
          requiredHeader: "x-casper-deploy-hash"
        }
      }
    ]
  };
}

export function getPaidLicenseProbeResult() {
  return analyzePackageJson(airBoardPackageJson);
}

export async function verifyCasperPayment(deployHash: string): Promise<CasperPaymentVerification> {
  const cleanedDeployHash = deployHash.trim();
  const required = getCasperPaymentRequirements();

  if (!cleanedDeployHash) {
    return {
      ok: false,
      status: "missing_deploy_hash",
      message: "Paste a Casper Testnet transaction or deploy hash before requesting the paid probe result.",
      required
    };
  }

  if (!casperPaymentConfig.payTo) {
    return {
      ok: false,
      status: "payment_account_not_configured",
      message:
        "Set CASPER_PAYMENT_ACCOUNT_HASH in the deployment environment so IP Breaker knows which Casper Testnet recipient account to verify.",
      deployHash: cleanedDeployHash,
      required
    };
  }

  try {
    const selected = await queryCasperRpcCandidates(cleanedDeployHash);

    if (!selected.ok || !selected.rpcResponse) {
      return {
        ok: false,
        status: "rpc_error",
        message: "Casper RPC did not return a usable transaction or deploy response.",
        deployHash: cleanedDeployHash,
        required,
        error: selected.error
      };
    }

    const rpcMethod = selected.method;
    const result = unwrapRpcResult(selected.rpcResponse.result);
    const success = hasExecutionSuccess(result);
    const amountMotes = extractTransferAmountMotes(result);
    const target = extractTransferTarget(result);
    const deployAccount = extractDeployAccount(result);
    const blockHash = extractBlockHash(result);
    const requiredMotes = csprToMotes(casperPaymentConfig.amountCSPR);
    const amountOk = amountMotes !== undefined && amountMotes >= requiredMotes;
    const targetOk = target !== undefined && sameCasperHash(target, casperPaymentConfig.payTo);

    const observed = {
      success,
      amountMotes: amountMotes?.toString(),
      amountCSPR: amountMotes === undefined ? undefined : motesToCSPR(amountMotes),
      target,
      deployAccount,
      blockHash,
      rpcMethod
    };

    if (!success) {
      return {
        ok: false,
        status: "deploy_not_successful",
        message: "The transaction exists, but its execution result is not successful yet.",
        deployHash: cleanedDeployHash,
        required,
        observed
      };
    }

    if (!amountOk) {
      return {
        ok: false,
        status: "amount_too_low_or_missing",
        message: `The transaction was found, but the transfer amount is missing or below ${casperPaymentConfig.amountCSPR} CSPR.`,
        deployHash: cleanedDeployHash,
        required,
        observed
      };
    }

    if (!targetOk) {
      return {
        ok: false,
        status: "recipient_mismatch",
        message: "The transaction was found, but the transfer target does not match the configured probe provider account.",
        deployHash: cleanedDeployHash,
        required,
        observed
      };
    }

    return {
      ok: true,
      status: "verified_on_chain",
      message: "Casper Testnet payment verified. The paid probe can now return the scan result.",
      deployHash: cleanedDeployHash,
      required,
      observed
    };
  } catch (error) {
    return {
      ok: false,
      status: "verification_error",
      message: "Unable to verify the Casper payment transaction. Check the transaction hash and RPC endpoint.",
      deployHash: cleanedDeployHash,
      required,
      error
    };
  }
}

type RpcPayload = {
  label: string;
  body: unknown;
};

type RpcAttempt = {
  ok: boolean;
  method: string;
  rpcResponse?: { result?: unknown; error?: unknown };
  error?: unknown;
};

async function queryCasperRpcCandidates(hash: string): Promise<RpcAttempt> {
  const payloads: RpcPayload[] = [
    {
      label: "info_get_transaction/version1-object",
      body: {
        id: 1,
        jsonrpc: "2.0",
        method: "info_get_transaction",
        params: [
          {
            name: "transaction_hash",
            value: {
              Version1: hash
            }
          },
          {
            name: "finalized_approvals",
            value: true
          }
        ]
      }
    },
    {
      label: "info_get_transaction/string-hash",
      body: {
        id: 1,
        jsonrpc: "2.0",
        method: "info_get_transaction",
        params: [
          {
            name: "transaction_hash",
            value: hash
          },
          {
            name: "finalized_approvals",
            value: true
          }
        ]
      }
    },
    {
      label: "info_get_deploy/string-hash",
      body: {
        id: 1,
        jsonrpc: "2.0",
        method: "info_get_deploy",
        params: [
          {
            name: "deploy_hash",
            value: hash
          },
          {
            name: "finalized_approvals",
            value: true
          }
        ]
      }
    },
    {
      label: "info_get_deploy/object-params",
      body: {
        id: 1,
        jsonrpc: "2.0",
        method: "info_get_deploy",
        params: {
          deploy_hash: hash,
          finalized_approvals: true
        }
      }
    }
  ];

  const errors: unknown[] = [];

  for (const payload of payloads) {
    const attempt = await postCasperRpc(payload.label, payload.body);
    if (attempt.ok) return attempt;
    errors.push({ method: payload.label, error: attempt.error });
  }

  return {
    ok: false,
    method: "all-rpc-candidates-failed",
    error: errors
  };
}

async function postCasperRpc(label: string, rpcPayload: unknown): Promise<RpcAttempt> {
  const response = await fetch(casperPaymentConfig.rpcUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(rpcPayload),
    cache: "no-store"
  });

  const rpcResponse = await response.json();

  if (!response.ok || rpcResponse.error) {
    return { ok: false, method: label, error: rpcResponse.error ?? rpcResponse };
  }

  return { ok: true, method: label, rpcResponse };
}

function unwrapRpcResult(result: unknown): unknown {
  if (isRecord(result) && "value" in result) return result.value;
  return result;
}

function csprToMotes(cspr: string): bigint {
  const [wholeRaw, decimalRaw = ""] = cspr.split(".");
  const whole = BigInt(wholeRaw || "0");
  const decimal = (decimalRaw + "000000000").slice(0, 9);
  return whole * MOTES_PER_CSPR + BigInt(decimal || "0");
}

function motesToCSPR(motes: bigint): string {
  const whole = motes / MOTES_PER_CSPR;
  const decimal = (motes % MOTES_PER_CSPR).toString().padStart(9, "0").replace(/0+$/, "");
  return decimal ? `${whole}.${decimal}` : whole.toString();
}

function hasExecutionSuccess(result: unknown): boolean {
  const executionInfo = isRecord(result) ? result.execution_info : undefined;

  if (isRecord(executionInfo)) {
    const text = JSON.stringify(executionInfo);
    return text.includes("execution_result") && !text.includes("Failure") && !text.includes("error_message\":\"");
  }

  const executionResults = isRecord(result) ? result.execution_results : undefined;
  if (Array.isArray(executionResults) && executionResults.length > 0) {
    const text = JSON.stringify(executionResults);
    return !text.includes("Failure") && !text.includes("error_message\":\"");
  }

  const text = JSON.stringify(result ?? {});
  return text.includes('"Success"') && !text.includes('"Failure"');
}

function extractTransferAmountMotes(result: unknown): bigint | undefined {
  const amountFromTransfer = findTransferField(result, "amount");
  const parsedTransferAmount = extractParsedValue(amountFromTransfer);

  if (parsedTransferAmount) {
    try {
      return BigInt(parsedTransferAmount);
    } catch {
      return undefined;
    }
  }

  const arg = findNamedArg(result, "amount");
  const parsed = extractParsedValue(arg);
  if (!parsed) return undefined;

  try {
    return BigInt(parsed);
  } catch {
    return undefined;
  }
}

function extractTransferTarget(result: unknown): string | undefined {
  const transferTo = findTransferField(result, "to");
  const parsedTransferTo = extractParsedValue(transferTo);
  if (parsedTransferTo) return parsedTransferTo;

  const arg = findNamedArg(result, "target");
  return extractParsedValue(arg);
}

function extractDeployAccount(result: unknown): string | undefined {
  if (!isRecord(result)) return undefined;

  const transaction = result.transaction;
  if (isRecord(transaction)) {
    const txText = JSON.stringify(transaction);
    const publicKeyMatch = txText.match(/"PublicKey":"([^"]+)"/);
    if (publicKeyMatch?.[1]) return publicKeyMatch[1];
  }

  const deploy = result.deploy;
  if (!isRecord(deploy)) return undefined;
  const account = deploy.account;
  return typeof account === "string" ? account : undefined;
}

function extractBlockHash(result: unknown): string | undefined {
  if (!isRecord(result)) return undefined;

  const executionInfo = result.execution_info;
  if (isRecord(executionInfo) && typeof executionInfo.block_hash === "string") {
    return executionInfo.block_hash;
  }

  const executionResults = result.execution_results;
  if (!Array.isArray(executionResults)) return undefined;
  const first = executionResults[0];
  if (!isRecord(first)) return undefined;
  const blockHash = first.block_hash;
  return typeof blockHash === "string" ? blockHash : undefined;
}

function findTransferField(node: unknown, field: string): unknown {
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findTransferField(item, field);
      if (found !== undefined) return found;
    }
  }

  if (isRecord(node)) {
    const version2 = node.Version2;
    if (isRecord(version2) && field in version2) return version2[field];

    if ("transfers" in node) {
      const transfers = node.transfers;
      const found = findTransferField(transfers, field);
      if (found !== undefined) return found;
    }

    for (const value of Object.values(node)) {
      const found = findTransferField(value, field);
      if (found !== undefined) return found;
    }
  }

  return undefined;
}

function findNamedArg(node: unknown, name: string): unknown {
  if (Array.isArray(node)) {
    for (const item of node) {
      if (Array.isArray(item) && item[0] === name) {
        return item[1];
      }
      const found = findNamedArg(item, name);
      if (found !== undefined) return found;
    }
  }

  if (isRecord(node)) {
    if (node.name === name && "value" in node) return node.value;
    if (name in node) return node[name];

    for (const value of Object.values(node)) {
      const found = findNamedArg(value, name);
      if (found !== undefined) return found;
    }
  }

  return undefined;
}

function extractParsedValue(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return undefined;

  if (typeof value.parsed === "string") return value.parsed;
  if (typeof value.bytes === "string") return value.bytes;
  if (typeof value.value === "string") return value.value;
  if (typeof value.AccountHash === "string") return value.AccountHash;

  return undefined;
}

function sameCasperHash(a: string, b: string): boolean {
  return normalizeCasperHash(a) === normalizeCasperHash(b);
}

function normalizeCasperHash(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^casper-testnet:/, "")
    .replace(/^account-hash-/, "")
    .replace(/^hash-/, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
