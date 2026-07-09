import type { Project } from "@/types/project";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-white/10 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="break-words text-xl font-bold">
          {project.name}
        </h3>

        <span className="self-start rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-400 sm:self-auto">
          Active
        </span>
      </div>

      <div className="mt-5 space-y-2 text-sm text-white/60">
        <p>Budget: --</p>
        <p>Milestones: --</p>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs text-white/50">
          <span>Progress</span>
          <span>0%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-2 w-0 rounded-full bg-blue-500 transition-all"></div>
        </div>
      </div>

      <div className="mt-6">
        <span className="inline-flex w-full items-center justify-center rounded-lg border border-white/10 px-4 py-3 text-sm transition hover:border-blue-500 hover:text-blue-400 sm:w-auto">
          View Project →
        </span>
      </div>
    </div>
  );
}
