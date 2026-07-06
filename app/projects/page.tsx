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
  <div className="mx-auto max-w-6xl px-6 py-16">    
 <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">  
<div>
  <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
    Dashboard
  </p>

  <h1 className="mt-2 text-4xl font-bold">
    Your Projects
  </h1>

  <p className="mt-3 text-white/60">
    Manage milestone payments, monitor project progress, and release funds securely.
  </p>
</div>      
  <Link
          href="/projects/new"
className="rounded-xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500"       
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

