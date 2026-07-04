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
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">New Project</h1>
      <p className="mt-1 text-sm text-white/50">
        Set the budget and milestone count — you&apos;ll define each
        milestone in detail on the next screen.
      </p>

      <div className="mt-8">
        <ProjectForm onCreate={handleCreate} />
      </div>
    </div>
  );
}
