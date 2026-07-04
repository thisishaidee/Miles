"use client";

import { useCallback, useEffect, useState } from "react";
import type { VaultState } from "@/types/vault";
import { getVaultState, FlowVaultError } from "@/lib/flowvault";

interface VaultStatusProps {
  walletAddress?: string;
}

type FetchStatus = "loading" | "success" | "error";

interface SummaryCard {
  label: string;
  value: number;
  accent: string;
}

function formatAmount(value: number): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function truncateTxHash(hash: string): string {
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

export default function VaultStatus({ walletAddress }: VaultStatusProps) {
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [vault, setVault] = useState<VaultState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchVaultState = useCallback(
    async (mode: "initial" | "refresh") => {
      if (mode === "initial") {
        setStatus("loading");
      } else {
        setIsRefreshing(true);
      }
      setErrorMessage(null);

      try {
        const state = await getVaultState(walletAddress ?? "");
        setVault(state);
        setStatus("success");
      } catch (error) {
        const message =
          error instanceof FlowVaultError
            ? error.message
            : "Failed to load vault state.";
        setErrorMessage(message);
        setStatus("error");
      } finally {
        if (mode === "refresh") {
          setIsRefreshing(false);
        }
      }
    },
    [walletAddress]
  );

  useEffect(() => {
    fetchVaultState("initial");
  }, [fetchVaultState]);

  function handleRefresh() {
    fetchVaultState("refresh");
  }

  const cards: SummaryCard[] = vault
    ? [
        {
          label: "Total Deposited",
          value: vault.totalDeposited,
          accent: "text-white",
        },
        {
          label: "Locked Balance",
          value: vault.lockedBalance,
          accent: "text-yellow-300",
        },
        {
          label: "Available Balance",
          value: vault.availableBalance,
          accent: "text-emerald-300",
        },
        {
          label: "Released Balance",
          value: vault.releasedBalance,
          accent: "text-vault-accent",
        },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-white/80">Vault Status</h2>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={status === "loading" || isRefreshing}
          className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isRefreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {status === "loading" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg border border-white/10 bg-vault-panel"
            />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-md border border-red-400/20 bg-red-400/10 p-4">
          <p className="text-sm text-red-300">{errorMessage}</p>
          <button
            type="button"
            onClick={handleRefresh}
            className="mt-2 text-xs font-medium text-red-200 underline underline-offset-2 hover:text-red-100"
          >
            Try again
          </button>
        </div>
      )}

      {status === "success" && vault && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className="rounded-lg border border-white/10 bg-vault-panel p-4"
              >
                <p className="text-xs text-white/50">{card.label}</p>
                <p className={`mt-1 text-xl font-semibold ${card.accent}`}>
                  {formatAmount(card.value)}
                </p>
              </div>
            ))}
          </div>

          {vault.txHash && (
            <div className="rounded-lg border border-white/10 bg-vault-panel p-3">
              <p className="text-xs text-white/50">Latest transaction</p>
              <p className="mt-1 break-all text-xs text-white/70">
                {truncateTxHash(vault.txHash)}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
