// Direct Stacks contract calls to FlowVault (no flowvault-sdk).
//
// State-changing calls (setRoutingRules, depositFunds, releaseMilestoneFunds)
// go through @stacks/connect's `request('stx_callContract', ...)`, which
// prompts the connected wallet to sign and broadcast. Reading vault state
// doesn't need a signature, so getVaultState uses @stacks/transactions'
// `fetchCallReadOnlyFunction`, which queries the Stacks API directly for a
// read-only Clarity function's result.
//
// VERIFIED CONTRACT SURFACE (per audit):
//   deposit(token principal, amount uint)
//   withdraw(token principal, amount uint)
//   set-routing-rules(lock-amount uint, lock-until-block uint,
//                      split-address (optional principal), split-amount uint)
//   get-vault-state -> {
//     total-balance, locked-balance, unlocked-balance,
//     lock-until-block, current-block, routing-rules
//   }
//
// The contract has no notion of "per-milestone arrays" or a "project id"
// argument — deposit/withdraw only take (token, amount), and routing is a
// single lock + optional split, not a full payout table. Assumptions that
// remain (flagged inline): the exact Clarity name "set-routing-rules"
// itself (only its argument shape was verified), the lock duration used
// to compute lock-until-block, and that routing simplifies to "lock the
// next pending milestone, optionally split a second one, leave the rest
// held" rather than modeling every milestone on-chain.

import { request } from "@stacks/connect";
import {
  Cl,
  Pc,
  PostConditionMode,
  fetchCallReadOnlyFunction,
  cvToJSON,
} from "@stacks/transactions";
import type { Project } from "@/types/project";
import type { Milestone } from "@/types/milestone";
import type { VaultState } from "@/types/vault";
import { getUserAddress } from "@/lib/stacks";
import {
  STACKS_NETWORK,
  STACKS_API_URL,
  FLOWVAULT_CONTRACT_ADDRESS,
  FLOWVAULT_CONTRACT_NAME,
  USDCX_TOKEN_CONTRACT_ADDRESS,
  USDCX_TOKEN_CONTRACT_NAME,
} from "@/lib/constants";

/** Thrown for any FlowVault call failure (routing, deposit, read, release). */
export class FlowVaultError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "FlowVaultError";
  }
}

/** Describes one slot (lock or split) configured by setRoutingRules(). */
export interface RoutingRule {
  milestoneId: string;
  recipient: string;
  amount: number;
}

/** Routing config / tx payload returned by setRoutingRules(). */
export interface RoutingConfig {
  projectId: string;
  totalAmount: number;
  rules: RoutingRule[];
  /** Present once the routing config has been submitted on-chain. */
  txHash?: string;
}

const FLOWVAULT_CONTRACT = `${FLOWVAULT_CONTRACT_ADDRESS}.${FLOWVAULT_CONTRACT_NAME}`;

/**
 * Base-unit scale for the usdcx SIP-010 token, assumed to follow the
 * common 6-decimal convention (like USDC). Confirm against the token
 * contract's `get-decimals` read-only function and adjust if different.
 */
const USDCX_DECIMALS = 6;

function toBaseUnits(amount: number): number {
  return Math.round(amount * 10 ** USDCX_DECIMALS);
}

function fromBaseUnits(amount: number): number {
  return amount / 10 ** USDCX_DECIMALS;
}

/**
 * How far past the current chain tip a lock should extend, in blocks.
 * ASSUMPTION: no lock-duration policy was specified — this is a
 * placeholder default and should be tuned to MileStack's actual escrow
 * terms (and to Stacks' real post-Nakamoto block time, which is much
 * faster than the old ~10-minute blocks).
 */
const DEFAULT_LOCK_DURATION_BLOCKS = 1008;

/** Verified/assumed Clarity entry points on flowvault-v2 — see file header. */
const CONTRACT_FUNCTIONS = {
  // Argument shape verified; the name itself is still an assumption.
  setRoutingRules: "set-routing-rules",
  // Verified.
  deposit: "deposit",
  withdraw: "withdraw",
  getVaultState: "get-vault-state",
} as const;

/** Throws if no wallet is connected; otherwise returns the STX address. */
function requireConnectedAddress(): string {
  const address = getUserAddress();

  if (!address) {
    throw new FlowVaultError(
      "No connected wallet. Connect a Stacks Testnet wallet before calling FlowVault."
    );
  }

  return address;
}

/**
 * Reads the current Stacks Testnet chain tip so lock-until-block can be
 * expressed as an absolute block height. Falls back to 0 on failure
 * (the contract call will still be attempted; the wallet/contract is the
 * final source of truth).
 */
async function fetchCurrentBlockHeight(): Promise<number> {
  try {
    const response = await fetch(`${STACKS_API_URL}/v2/info`);
    if (!response.ok) return 0;

    const data = await response.json();
    return Number(data?.stacks_tip_height ?? data?.burn_block_height ?? 0);
  } catch (error) {
    console.warn("[flowvault] Failed to fetch current block height:", error);
    return 0;
  }
}

/**
 * Configures FlowVault's routing for a project using the vault's actual
 * (simplified) model: a single lock slot plus an optional split slot —
 * not a full per-milestone routing table.
 *
 *  - lock-amount / lock-until-block: the project's next pending
 *    milestone is locked for DEFAULT_LOCK_DURATION_BLOCKS.
 *  - split-address / split-amount: only set if a *second* pending
 *    milestone exists; otherwise omitted (none / 0). Everything beyond
 *    the lock (and optional split) is simply left held in the vault.
 */
export async function setRoutingRules(project: Project): Promise<RoutingConfig> {
  const pending = project.milestones.filter((m) => m.status === "pending");
  const lockTarget = pending[0];
  const splitTarget = pending[1]; // only used if a second slot is needed

  const lockAmount = lockTarget ? toBaseUnits(lockTarget.amount) : 0;
  const splitAmount = splitTarget ? toBaseUnits(splitTarget.amount) : 0;

  try {
    requireConnectedAddress();

    const currentBlock = await fetchCurrentBlockHeight();
    const lockUntilBlock = currentBlock + DEFAULT_LOCK_DURATION_BLOCKS;

    const functionArgs = [
      Cl.uint(lockAmount),
      Cl.uint(lockUntilBlock),
      splitTarget
        ? Cl.some(Cl.principal(splitTarget.contributorWallet))
        : Cl.none(),
      Cl.uint(splitAmount),
    ];

    const response = await request("stx_callContract", {
      contract: FLOWVAULT_CONTRACT,
      functionName: CONTRACT_FUNCTIONS.setRoutingRules,
      functionArgs,
      network: STACKS_NETWORK,
      postConditionMode: "deny",
      postConditions: [],
    });

    const rules: RoutingRule[] = [
      ...(lockTarget
        ? [
            {
              milestoneId: lockTarget.id,
              recipient: lockTarget.contributorWallet,
              amount: lockTarget.amount,
            },
          ]
        : []),
      ...(splitTarget
        ? [
            {
              milestoneId: splitTarget.id,
              recipient: splitTarget.contributorWallet,
              amount: splitTarget.amount,
            },
          ]
        : []),
    ];

    return {
      projectId: project.id,
      totalAmount: rules.reduce((sum, rule) => sum + rule.amount, 0),
      rules,
      txHash: response?.txid,
    };
  } catch (error) {
    if (error instanceof FlowVaultError) throw error;
    throw new FlowVaultError(
      "Failed to configure FlowVault routing rules for this project.",
      error
    );
  }
}

/**
 * Deposits into FlowVault using the connected wallet as signer. Calls
 * the verified `(deposit token amount)` entry point with the usdcx
 * token principal and the project's full budget.
 */
export async function depositFunds(
  project: Project
): Promise<{ txHash: string }> {
  try {
    const sender = requireConnectedAddress();
    const amountBaseUnits = toBaseUnits(project.totalBudget);
    const tokenPrincipal = Cl.contractPrincipal(
      USDCX_TOKEN_CONTRACT_ADDRESS,
      USDCX_TOKEN_CONTRACT_NAME
    );

    const depositPostCondition = Pc.principal(sender)
      .willSendEq(amountBaseUnits)
      .ft(
        `${USDCX_TOKEN_CONTRACT_ADDRESS}.${USDCX_TOKEN_CONTRACT_NAME}`,
        USDCX_TOKEN_CONTRACT_NAME
      );

    const response = await request("stx_callContract", {
      contract: FLOWVAULT_CONTRACT,
      functionName: CONTRACT_FUNCTIONS.deposit,
      functionArgs: [tokenPrincipal, Cl.uint(amountBaseUnits)],
      network: STACKS_NETWORK,
      postConditions: [depositPostCondition],
      postConditionMode: PostConditionMode.Deny,
    });

    if (!response?.txid) {
      throw new FlowVaultError(
        "FlowVault deposit did not return a transaction id."
      );
    }

    return { txHash: response.txid };
  } catch (error) {
    if (error instanceof FlowVaultError) throw error;
    throw new FlowVaultError(
      `Failed to deposit ${project.totalBudget} into FlowVault for project ${project.id}.`,
      error
    );
  }
}

/**
 * Releases a milestone's payout once it has been marked completed,
 * calling the verified `(withdraw token amount)` entry point with the
 * usdcx token principal and the milestone's amount.
 */
export async function releaseMilestoneFunds(
  milestone: Milestone
): Promise<{ txHash: string }> {
  if (milestone.status !== "completed") {
    throw new FlowVaultError(
      `Milestone "${milestone.title || milestone.id}" must be marked completed before its funds can be released.`
    );
  }

  try {
    requireConnectedAddress();
    const amountBaseUnits = toBaseUnits(milestone.amount);
    const tokenPrincipal = Cl.contractPrincipal(
      USDCX_TOKEN_CONTRACT_ADDRESS,
      USDCX_TOKEN_CONTRACT_NAME
    );

    // The vault contract is the one sending funds out here, so the
    // post-condition principal is the contract itself, not the caller.
    const releasePostCondition = Pc.principal(FLOWVAULT_CONTRACT)
      .willSendEq(amountBaseUnits)
      .ft(
        `${USDCX_TOKEN_CONTRACT_ADDRESS}.${USDCX_TOKEN_CONTRACT_NAME}`,
        USDCX_TOKEN_CONTRACT_NAME
      );

    const response = await request("stx_callContract", {
      contract: FLOWVAULT_CONTRACT,
      functionName: CONTRACT_FUNCTIONS.withdraw,
      functionArgs: [tokenPrincipal, Cl.uint(amountBaseUnits)],
      network: STACKS_NETWORK,
      postConditions: [releasePostCondition],
      postConditionMode: PostConditionMode.Deny,
    });

    if (!response?.txid) {
      throw new FlowVaultError(
        "FlowVault withdraw did not return a transaction id."
      );
    }

    return { txHash: response.txid };
  } catch (error) {
    if (error instanceof FlowVaultError) throw error;
    throw new FlowVaultError(
      `Failed to release funds for milestone ${milestone.id}.`,
      error
    );
  }
}

/**
 * Parses get-vault-state's verified return shape:
 *   { total-balance, locked-balance, unlocked-balance,
 *     lock-until-block, current-block, routing-rules }
 * into MileStack's VaultState. releasedBalance isn't tracked by the
 * contract at all — the vault only knows what's locked vs. unlocked, not
 * what's already left the vault — so it's derived client-side (see
 * deriveReleasedBalance below) rather than read from chain.
 */
function parseVaultStateResult(resultCv: unknown): VaultState {
  const json = cvToJSON(resultCv as never);
  // `ok` responses nest the tuple one level deeper than `err`/plain values.
  const tuple = json?.value?.value ?? json?.value ?? {};

  const readUint = (field: string): number => {
    const raw = tuple?.[field]?.value;
    const parsed = raw !== undefined ? Number(raw) : 0;
    return Number.isFinite(parsed) ? fromBaseUnits(parsed) : 0;
  };

  return {
    totalDeposited: readUint("total-balance"),
    lockedBalance: readUint("locked-balance"),
    availableBalance: readUint("unlocked-balance"),
    // Not exposed by the contract — see deriveReleasedBalance().
    releasedBalance: 0,
  };
}

/**
 * Client-side derivation of "released balance" for a project, since
 * FlowVault's on-chain state doesn't track it. Sums the amounts of
 * milestones already marked "released" in MileStack's own records.
 * Callers that need releasedBalance should use this alongside
 * getVaultState() rather than expecting it in the on-chain response.
 */
export function deriveReleasedBalance(project: Project): number {
  return project.milestones
    .filter((m) => m.status === "released")
    .reduce((sum, m) => sum + m.amount, 0);
}

/**
 * Fetches the current on-chain vault balances via a read-only contract
 * call (no signature / wallet prompt required).
 *
 * IMPORTANT MISMATCH: the verified flowvault-v2 contract has no
 * project-id concept anywhere — deposit/withdraw only take
 * (token, amount), which means a vault is scoped to the *calling
 * principal*, not to an arbitrary project id string. There is currently
 * no on-chain or off-chain mapping from a MileStack project id to the
 * principal that funded it, so `projectId` can't actually be sent to
 * get-vault-state (a UUID isn't a valid Clarity principal, and the
 * contract wouldn't recognize it if it were). Until that mapping exists
 * (e.g. persisting project.clientWallet and looking it up here), this
 * queries the *connected wallet's own* vault state and keeps the
 * `projectId` parameter only so this function's exported signature
 * doesn't change for the rest of the app.
 */
export async function getVaultState(projectId: string): Promise<VaultState> {
  try {
    const ownerAddress = getUserAddress();

    if (!ownerAddress) {
      throw new FlowVaultError(
        "Connect a wallet to view its FlowVault state."
      );
    }

    const resultCv = await fetchCallReadOnlyFunction({
      contractAddress: FLOWVAULT_CONTRACT_ADDRESS,
      contractName: FLOWVAULT_CONTRACT_NAME,
      functionName: CONTRACT_FUNCTIONS.getVaultState,
      functionArgs: [Cl.principal(ownerAddress)],
      network: STACKS_NETWORK,
      senderAddress: ownerAddress,
    });

    return parseVaultStateResult(resultCv);
  } catch (error) {
    if (error instanceof FlowVaultError) throw error;
    throw new FlowVaultError(
      `Failed to fetch FlowVault state for project ${projectId}.`,
      error
    );
  }
}
