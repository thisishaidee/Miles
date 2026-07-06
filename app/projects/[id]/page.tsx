"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MilestoneList from "@/components/MilestoneList";
import DepositForm from "@/components/DepositForm";
import {
  getProject,
  saveProject,
  deleteProject,
} from "@/lib/projectStore";
import type { Project } from "@/types/project";

interface ProjectDetailPageProps {
  params: { id: string };
}

export default function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const router = useRouter();

  const [project, setProject] = useState<Project | null | undefined>(
    undefined
  );

  useEffect(() => {
    setProject(getProject(params.id));
  }, [params.id]);

  function handleMilestonesUpdate(updated: Project) {
    saveProject(updated);
    setProject(updated);
  }

  function handleDeposit(txHash: string) {
    if (!project) return;

    router.push(`/vault/${project.id}`);
  }

  function handleDelete() {
    if (!project) return;

    const confirmed = window.confirm(
      "Delete this project? This action cannot be undone."
    );

    if (!confirmed) return;

    deleteProject(project.id);
    router.push("/");
  }

  if (project === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm text-white/50">
          Loading project…
        </p>
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm text-white/50">
          Project not found.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-6 py-16">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {project.name}
          </h1>

          <p className="mt-1 text-sm text-white/50">
            Client wallet: {project.clientWallet}
          </p>
        </div>

        <button
          onClick={handleDelete}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Delete Project
        </button>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-medium">
          Milestones
        </h2>

        <MilestoneList
          project={project}
          onUpdate={handleMilestonesUpdate}
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">
          Fund Vault
        </h2>

        <DepositForm
          project={project}
          onDeposit={handleDeposit}
        />
      </section>
    </div>
  );
}
