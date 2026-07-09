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
<div className="min-h-screen bg-black text-white">
<div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
 <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">  
<div>
  <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
    Dashboard
  </p>

<h1 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
    Your Projects
  </h1>

  <p className="mt-3 max-w-2xl text-white/60">
    Manage milestone payments, monitor project progress, and release funds securely.
  </p>
</div>      
  <Link
          href="/projects/new"
    className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500 sm:w-auto"
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
    </div>
  );
}

