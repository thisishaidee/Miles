"use client";

import { useRouter } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";
import { saveProject } from "@/lib/projectStore";
import type { Project } from "@/types/project";

export default function NewProjectPage() {
  const router = useRouter();

  function handleCreate(project: Project) {
    saveProject(project);
    router.push(`/projects/${project.id}`);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Create New Project
        </h1>

        <p className="mt-3 text-white/60">
          Set your project budget, invite contributors, and prepare milestone-based escrow.
        </p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8">
          <ProjectForm onCreate={handleCreate} />
        </div>
      </div>
    </main>
  );
}
