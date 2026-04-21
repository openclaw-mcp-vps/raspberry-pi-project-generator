import Link from "next/link";
import { ArrowRight, Gauge } from "lucide-react";
import type { ProjectRecommendation } from "@/lib/types";

interface ProjectCardProps {
  project: ProjectRecommendation;
}

function prettifySlug(value: string): string {
  return value
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-xl border border-[#30363d] bg-[#161b22]/85 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-blue-300">{project.difficulty}</p>
        <p className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-100">
          <Gauge className="h-3.5 w-3.5" />
          {project.score}% match
        </p>
      </div>

      <h3 className="mt-3 text-xl font-semibold">{project.title}</h3>
      <p className="mt-2 text-sm text-slate-300">{project.summary}</p>

      <p className="mt-4 text-xs text-slate-400">Estimated build time: {project.estimatedTime}</p>

      <ul className="mt-4 space-y-2 text-sm text-slate-200">
        {project.reasons.map((reason) => (
          <li key={reason} className="rounded-md border border-[#30363d] bg-[#0d1117]/70 px-3 py-2">
            {reason}
          </li>
        ))}
      </ul>

      {project.missingComponents.length > 0 ? (
        <p className="mt-4 text-xs text-amber-200">
          Missing parts: {project.missingComponents.map(prettifySlug).join(", ")}
        </p>
      ) : (
        <p className="mt-4 text-xs text-emerald-300">You already have every required part.</p>
      )}

      <Link
        href={`/project/${project.id}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-300 transition hover:text-blue-200"
      >
        Open full guide
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
