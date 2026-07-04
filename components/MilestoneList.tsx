"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/types/project";
import type { Milestone } from "@/types/milestone";
import MilestoneItem, { type MilestoneFieldErrors } from "@/components/MilestoneItem";

interface MilestoneListProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

type ErrorMap = Record<string, MilestoneFieldErrors>;

export default function MilestoneList({ project, onUpdate }: MilestoneListProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(project.milestones);
  const [fieldErrors, setFieldErrors] = useState<ErrorMap>({});
  const [totalError, setTotalError] = useState<string | undefined>();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const runningTotal = useMemo(
    () => milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0),
    [milestones]
  );
  const remaining = project.totalBudget - runningTotal;

  function handleMilestoneChange(id: string, updates: Partial<Milestone>) {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              ...updates,
              id: m.id, // preserve id
              status: m.status, // preserve status
            }
          : m
      )
    );
    setSavedAt(null);
  }

  function handleMilestoneRelease(milestoneId: string, txHash: string) {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              id: m.id, // preserve id
              title: m.title, // preserve title
              amount: m.amount, // preserve amount
              contributorWallet: m.contributorWallet, // preserve contributorWallet
              status: "released",
            }
          : m
      )
    );

    // txHash is already surfaced by ReleasePayoutButton itself;
    // MilestoneList only needs it here to know a release just happened.
    void txHash;
  }

  function validate(): boolean {
    const nextFieldErrors: ErrorMap = {};

    milestones.forEach((m) => {
      const errors: MilestoneFieldErrors = {};

      if (!m.title.trim()) {
        errors.title = "Title is required.";
      }
      if (!(Number(m.amount) > 0)) {
        errors.amount = "Amount must be greater than 0.";
      }
      if (!m.contributorWallet.trim()) {
        errors.contributorWallet = "Contributor wallet is required.";
      }

      if (Object.keys(errors).length > 0) {
        nextFieldErrors[m.id] = errors;
      }
    });

    setFieldErrors(nextFieldErrors);

    const sum = milestones.reduce((s, m) => s + (Number(m.amount) || 0), 0);
    const sumMatches = sum === project.totalBudget;

    setTotalError(
      sumMatches
        ? undefined
        : `Milestone amounts total ${sum.toLocaleString()}, but the project budget is ${project.totalBudget.toLocaleString()}. These must match exactly.`
    );

    return Object.keys(nextFieldErrors).length === 0 && sumMatches;
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) {
      setSavedAt(null);
      return;
    }

    onUpdate({ ...project, milestones });
    setSavedAt(Date.now());
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            index={index}
            errors={fieldErrors[milestone.id]}
            onChange={handleMilestoneChange}
            onRelease={handleMilestoneRelease}
          />
        ))}
      </div>

      <div className="rounded-lg border border-white/10 bg-vault-panel p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Running total</span>
          <span className="font-medium">{runningTotal.toLocaleString()}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-white/60">Project budget</span>
          <span className="font-medium">
            {project.totalBudget.toLocaleString()}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-white/60">Remaining</span>
          <span
            className={`font-medium ${
              remaining === 0
                ? "text-emerald-400"
                : remaining < 0
                ? "text-red-400"
                : "text-white"
            }`}
          >
            {remaining.toLocaleString()}
          </span>
        </div>

        {totalError && (
          <p className="mt-3 text-xs text-red-400">{totalError}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-vault-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Save Milestones
      </button>

      {savedAt && (
        <p className="text-center text-xs text-emerald-400">
          Milestones saved.
        </p>
      )}
    </form>
  );
}
