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
          method: "Casper JSON-RPC info_get_deploy",
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
      message: "Paste a Casper Testnet deploy hash before requesting the paid probe result.",
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

  const rpcPayload = {
    id: 1,
    jsonrpc: "2.0",
    method: "info_get_deploy",
    params: {
      deploy_hash: cleanedDeployHash
    }
  };

  try {
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
      return {
        ok: false,
        status: "rpc_error",
        message: "Casper RPC did not return a usable deploy response.",
        deployHash: cleanedDeployHash,
        required,
        error: rpcResponse.error ?? rpcResponse
      };
    }

    const result = rpcResponse.result;
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
      blockHash
    };

    if (!success) {
      return {
        ok: false,
        status: "deploy_not_successful",
        message: "The deploy exists, but its execution result is not successful yet.",
        deployHash: cleanedDeployHash,
        required,
        observed
      };
    }

    if (!amountOk) {
      return {
        ok: false,
        status: "amount_too_low_or_missing",
        message: `The deploy was found, but the transfer amount is missing or below ${casperPaymentConfig.amountCSPR} CSPR.`,
        deployHash: cleanedDeployHash,
        required,
        observed
      };
    }

    if (!targetOk) {
      return {
        ok: false,
        status: "recipient_mismatch",
        message: "The deploy was found, but the transfer target does not match the configured probe provider account.",
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
      message: "Unable to verify the Casper payment deploy. Check the deploy hash and RPC endpoint.",
      deployHash: cleanedDeployHash,
      required,
      error
    };
  }
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
  const text = JSON.stringify(result ?? {});
  return text.includes('"Success"') && !text.includes('"Failure"');
}

function extractTransferAmountMotes(result: unknown): bigint | undefined {
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
  const arg = findNamedArg(result, "target");
  return extractParsedValue(arg);
}

function extractDeployAccount(result: unknown): string | undefined {
  if (!isRecord(result)) return undefined;
  const deploy = result.deploy;
  if (!isRecord(deploy)) return undefined;
  const account = deploy.account;
  return typeof account === "string" ? account : undefined;
}

function extractBlockHash(result: unknown): string | undefined {
  if (!isRecord(result)) return undefined;
  const executionResults = result.execution_results;
  if (!Array.isArray(executionResults)) return undefined;
  const first = executionResults[0];
  if (!isRecord(first)) return undefined;
  const blockHash = first.block_hash;
  return typeof blockHash === "string" ? blockHash : undefined;
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
