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
     <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16"> 
        <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
          Dashboard
        </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
          Create New Project
        </h1>

        <p className="mt-3 max-w-2xl text-white/60">
          Set your project budget, invite contributors, and prepare milestone-based escrow.
        </p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-8">
          <ProjectForm onCreate={handleCreate} />
        </div>
      </div>
    </main>
  );
}
