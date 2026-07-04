"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { listProjects } from "@/lib/projectStore";
import type { Project } from "@/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    setProjects(listProjects());
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link
          href="/projects/new"
          className="rounded-md bg-vault-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          New Project
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {projects === null && (
          <p className="text-sm text-white/50">Loading projects…</p>
        )}

        {projects?.length === 0 && (
          <p className="text-sm text-white/50">
            No projects yet. Create one to get started.
          </p>
        )}

        {projects?.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    </div>
  );
}
