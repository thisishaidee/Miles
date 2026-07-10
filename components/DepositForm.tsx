"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/types/project";
import { getUserAddress } from "@/lib/stacks";
import { setRoutingRules, depositFunds, FlowVaultError } from "@/lib/flowvault";

interface DepositFormProps {
  project: Project;
  onDeposit: (txHash: string) => void;
}

type DepositStatus = "idle" | "loading" | "success" | "error";

function validateMilestones(project: Project): string | null {
  if (project.milestones.length === 0) {
    return "This project has no milestones to fund.";
  }

  for (const milestone of project.milestones) {
    if (!milestone.title.trim()) {
      return "Every milestone needs a title before depositing.";
    }

    if (!(Number(milestone.amount) > 0)) {
      return "Every milestone amount must be greater than 0.";
    }

    if (!milestone.contributorWallet.trim()) {
      return "Every milestone needs a contributor wallet before depositing.";
    }
  }

  const sum = project.milestones.reduce(
    (total, m) => total + (Number(m.amount) || 0),
    0
  );

  if (sum !== project.totalBudget) {
    return `Milestone amounts total ${sum.toLocaleString()}, which doesn't match the project budget of ${project.totalBudget.toLocaleString()}.`;
  }

  return null;
}

export default function DepositForm({
  project,
  onDeposit,
}: DepositFormProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<DepositStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setWalletAddress(getUserAddress());
  }, []);

  const milestonesError = validateMilestones(project);
  const isWalletConnected = Boolean(walletAddress);

  const alreadyFunded =
    (project.vaultBalance ?? 0) >= project.totalBudget;

  const isDisabled =
    !isWalletConnected ||
    Boolean(milestonesError) ||
    status === "loading" ||
    alreadyFunded;

async function handleDeposit() {
  if (!alreadyFunded) {
    setStatus("loading");
  setErrorMessage(null);
    setTxHash(null);

    try {
      await setRoutingRules(project);

      const result = await depositFunds(project);

      setTxHash(result.txHash);
      setStatus("success");
      onDeposit(result.txHash);
    } catch (error) {
      const message =
        error instanceof FlowVaultError
          ? error.message
          : String(error);

     setErrorMessage(message);
      setStatus("error");
    }
  }
}

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-vault-panel p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">
          Total Budget
        </span>

        <span className="text-lg font-semibold">
          {project.totalBudget.toLocaleString()}
        </span>
      </div>

      <button
        type="button"
        onClick={handleDeposit}
        disabled={isDisabled}
        className="w-full rounded-md bg-vault-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading"
          ? "Depositing..."
          : alreadyFunded
          ? "✓ Funds Deposited"
          : "Deposit to FlowVault"}
      </button>

      {alreadyFunded && (
        <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 p-3">
          <p className="text-xs font-medium text-emerald-300">
            This project has already been funded.
          </p>
        </div>
      )}

      {!isWalletConnected && (
        <p className="text-xs text-white/50">
          Connect a wallet to deposit into FlowVault.
        </p>
      )}

      {isWalletConnected && milestonesError && (
        <p className="text-xs text-yellow-400">
          {milestonesError}
        </p>
      )}

      {status === "loading" && (
        <p className="text-xs text-white/60">
          Configuring routing rules and depositing funds — confirm the
          transaction in your wallet...
        </p>
      )}

      {status === "success" && txHash && (
        <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 p-3">
          <p className="text-xs font-medium text-emerald-300">
            Deposit successful.
          </p>

          <p className="mt-1 break-all text-xs text-emerald-200/80">
            Tx hash: {txHash}
          </p>
        </div>
      )}

      {status === "error" && errorMessage && (
        <div className="rounded-md border border-red-400/20 bg-red-400/10 p-3">
          <p className="text-xs text-red-300">
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
}
