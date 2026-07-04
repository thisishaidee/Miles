import type { Project } from "@/types/project";

export default function ProjectCard({ project }: { project: Project }) {
  // TODO: Render project summary (name, budget, status) with link to detail page
  return (
    <div className="rounded-lg border border-white/10 bg-vault-panel p-4">
      <p className="font-medium">{project.name}</p>
    </div>
  );
}
