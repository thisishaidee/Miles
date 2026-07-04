"use client";

import { useEffect, useState } from "react";
import VaultStatus from "@/components/VaultStatus";
import { getUserAddress } from "@/lib/stacks";

interface VaultDetailPageProps {
  params: { id: string };
}

export default function VaultDetailPage({ params }: VaultDetailPageProps) {
  // Vault state is wallet-scoped, not project-scoped (see lib/flowvault.ts),
  // so this reads the connected wallet's address rather than using params.id.
  const [walletAddress, setWalletAddress] = useState<string | undefined>();

  useEffect(() => {
    setWalletAddress(getUserAddress() ?? undefined);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Vault</h1>
      <VaultStatus walletAddress={walletAddress} />
    </div>
  );
}
