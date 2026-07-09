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

    const confirmation = window.prompt(
      `This action cannot be undone.\n\nType "${project.name}" to permanently delete this project.`
    );

    if (confirmation === null) return;

    if (confirmation.trim() !== project.name) {
      window.alert("Project name doesn't match. Project was not deleted.");
      return;
    }

    deleteProject(project.id);

    window.alert("Project deleted successfully.");

    router.push("/projects");
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
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {project.name}
          </h1>

          <p className="mt-1 break-all text-sm text-white/50">
            Client wallet: {project.clientWallet}
          </p>
        </div>

        <button
          onClick={handleDelete}
          className="rounded-lg border border-red-500 px-5 py-2 text-sm font-medium text-red-400 transition hover:bg-red-600 hover:text-white"
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
