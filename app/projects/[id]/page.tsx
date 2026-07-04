"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MilestoneList from "@/components/MilestoneList";
import DepositForm from "@/components/DepositForm";
import { getProject, saveProject } from "@/lib/projectStore";
import type { Project } from "@/types/project";

interface ProjectDetailPageProps {
  params: { id: string };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter();
  // undefined = still loading, null = not found
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    setProject(getProject(params.id));
  }, [params.id]);

  function handleMilestonesUpdate(updated: Project) {
    saveProject(updated);
    setProject(updated);
  }

  function handleDeposit() {
    if (!project) return;

    // Reflect the deposit locally in mock storage; FlowVault itself is
    // the source of truth once on-chain, but this keeps the vault page
    // and other views consistent immediately after a deposit.
    const updated: Project = { ...project, vaultBalance: project.totalBudget };
    saveProject(updated);
    setProject(updated);

    router.push(`/vault/${project.id}`);
  }

  if (project === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm text-white/50">Loading project…</p>
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm text-white/50">
          Project not found.{" "}
          <a href="/projects/new" className="text-vault-accent underline">
            Create a new one
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="mt-1 text-sm text-white/50">
          Client wallet: {project.clientWallet}
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-medium">Milestones</h2>
        <MilestoneList project={project} onUpdate={handleMilestonesUpdate} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Fund Vault</h2>
        <DepositForm project={project} onDeposit={handleDeposit} />
      </section>
    </div>
  );
}
