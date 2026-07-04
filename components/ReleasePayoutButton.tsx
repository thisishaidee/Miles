"use client";

import { useState } from "react";
import type { Milestone } from "@/types/milestone";
import { releaseMilestoneFunds, FlowVaultError } from "@/lib/flowvault";

interface ReleasePayoutButtonProps {
  milestone: Milestone;
  onRelease: (txHash: string) => void;
}

type ReleaseStatus = "idle" | "loading" | "success" | "error";

export default function ReleasePayoutButton({
  milestone,
  onRelease,
}: ReleasePayoutButtonProps) {
  const [status, setStatus] = useState<ReleaseStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const alreadyReleased = milestone.status === "released";
  const isCompleted = milestone.status === "completed";
  const isDisabled = !isCompleted || alreadyReleased || status === "loading";

  async function handleRelease() {
    if (!isCompleted || alreadyReleased) {
      return;
    }

    setStatus("loading");
    setErrorMessage(null);
    setTxHash(null);

    try {
      const result = await releaseMilestoneFunds(milestone);
      setTxHash(result.txHash);
      setStatus("success");
      onRelease(result.txHash);
    } catch (error) {
      const message =
        error instanceof FlowVaultError
          ? error.message
          : "Something went wrong while releasing this payout.";
      setErrorMessage(message);
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleRelease}
        disabled={isDisabled}
        className="rounded-md bg-vault-accent px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === "loading"
          ? "Releasing…"
          : alreadyReleased
          ? "Released"
          : "Release Payout"}
      </button>

      {!isCompleted && !alreadyReleased && (
        <p className="text-[11px] text-white/40">
          Mark this milestone completed to release its payout.
        </p>
      )}

      {alreadyReleased && status !== "success" && (
        <p className="text-[11px] text-white/40">
          This milestone has already been released.
        </p>
      )}

      {status === "loading" && (
        <p className="text-[11px] text-white/60">
          Confirm the transaction in your wallet…
        </p>
      )}

      {status === "success" && txHash && (
        <div className="max-w-xs rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-right">
          <p className="text-[11px] font-medium text-emerald-300">
            Payout released.
          </p>
          <p className="break-all text-[11px] text-emerald-200/80">
            Tx hash: {txHash}
          </p>
        </div>
      )}

      {status === "error" && errorMessage && (
        <div className="max-w-xs rounded-md border border-red-400/20 bg-red-400/10 px-2 py-1 text-right">
          <p className="text-[11px] text-red-300">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
