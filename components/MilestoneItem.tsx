"use client";

import type { Milestone } from "@/types/milestone";
import ReleasePayoutButton from "@/components/ReleasePayoutButton";

export interface MilestoneFieldErrors {
  title?: string;
  amount?: string;
  contributorWallet?: string;
}

interface MilestoneItemProps {
  milestone: Milestone;
  index: number;
  errors?: MilestoneFieldErrors;
  onChange: (id: string, updates: Partial<Milestone>) => void;
  onRelease: (milestoneId: string, txHash: string) => void;
}

const STATUS_STYLES: Record<Milestone["status"], string> = {
  pending: "bg-white/10 text-white/60",
  completed: "bg-yellow-400/10 text-yellow-300",
  released: "bg-emerald-400/10 text-emerald-300",
};

export default function MilestoneItem({
  milestone,
  index,
  errors,
  onChange,
  onRelease,
}: MilestoneItemProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-vault-panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-white/40">
          Milestone {index + 1}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLES[milestone.status]}`}
        >
          {milestone.status}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label
            htmlFor={`title-${milestone.id}`}
            className="mb-1 block text-xs font-medium text-white/60"
          >
            Title
          </label>
          <input
            id={`title-${milestone.id}`}
            type="text"
            value={milestone.title}
            onChange={(e) => onChange(milestone.id, { title: e.target.value })}
            placeholder="e.g. Design mockups"
            className="w-full rounded-md border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-vault-accent focus:outline-none"
          />
          {errors?.title && (
            <p className="mt-1 text-xs text-red-400">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor={`amount-${milestone.id}`}
            className="mb-1 block text-xs font-medium text-white/60"
          >
            Amount
          </label>
          <input
            id={`amount-${milestone.id}`}
            type="number"
            min="0"
            step="any"
            value={milestone.amount === 0 ? "" : milestone.amount}
            onChange={(e) =>
              onChange(milestone.id, {
                amount: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
            placeholder="e.g. 1000"
            className="w-full rounded-md border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-vault-accent focus:outline-none"
          />
          {errors?.amount && (
            <p className="mt-1 text-xs text-red-400">{errors.amount}</p>
          )}
        </div>

        <div>
          <label
            htmlFor={`wallet-${milestone.id}`}
            className="mb-1 block text-xs font-medium text-white/60"
          >
            Contributor Wallet
          </label>
          <input
            id={`wallet-${milestone.id}`}
            type="text"
            value={milestone.contributorWallet}
            onChange={(e) =>
              onChange(milestone.id, { contributorWallet: e.target.value })
            }
            placeholder="e.g. SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0H"
            className="w-full rounded-md border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-vault-accent focus:outline-none"
          />
          {errors?.contributorWallet && (
            <p className="mt-1 text-xs text-red-400">
              {errors.contributorWallet}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <ReleasePayoutButton
          milestone={milestone}
          onRelease={(txHash) => onRelease(milestone.id, txHash)}
        />
      </div>
    </div>
  );
}
