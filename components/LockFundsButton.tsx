"use client";

export default function LockFundsButton({ projectId }: { projectId: string }) {
  // TODO: Trigger FlowVault lock() call for this project's vault
  return (
    <button className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium">
      Lock Funds
    </button>
  );
}
