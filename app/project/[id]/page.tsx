import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Code2, Clock3, ListChecks, Wrench } from "lucide-react";
import WiringDiagram from "@/components/WiringDiagram";
import { getProjectById } from "@/lib/projectGenerator";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return {
      title: "Project not found"
    };
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} | Raspberry Pi Project Generator`,
      description: project.summary
    }
  };
}

export default async function ProjectDetailPage({
  params
}: {
  params: Params;
}) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-10 sm:px-8">
      <Link
        href="/generator"
        className="mb-6 inline-flex items-center gap-2 text-sm text-blue-300 transition hover:text-blue-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to generator
      </Link>

      <section className="rounded-2xl border border-[#30363d] bg-[#161b22]/80 p-7">
        <p className="text-xs uppercase tracking-[0.18em] text-blue-300">{project.difficulty}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
        <p className="mt-4 text-slate-300">{project.overview}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117]/70 p-4 text-sm text-slate-300">
            <p className="inline-flex items-center gap-2 font-medium text-slate-100">
              <Clock3 className="h-4 w-4 text-blue-300" /> Estimated time
            </p>
            <p className="mt-1">{project.estimatedTime}</p>
          </div>
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117]/70 p-4 text-sm text-slate-300">
            <p className="inline-flex items-center gap-2 font-medium text-slate-100">
              <Wrench className="h-4 w-4 text-blue-300" /> Required components
            </p>
            <p className="mt-1">{project.requiredComponents.length} parts</p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[#30363d] bg-[#161b22]/80 p-7">
        <h2 className="inline-flex items-center gap-2 text-xl font-semibold">
          <ListChecks className="h-5 w-5 text-blue-300" /> Build steps
        </h2>
        <ol className="mt-5 space-y-4">
          {project.steps.map((step, index) => (
            <li key={step.title} className="rounded-lg border border-[#30363d] bg-[#0d1117]/70 p-4">
              <p className="text-sm text-blue-300">Step {index + 1}</p>
              <h3 className="mt-1 text-lg font-medium">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 rounded-2xl border border-[#30363d] bg-[#161b22]/80 p-7">
        <h2 className="inline-flex items-center gap-2 text-xl font-semibold">
          <Code2 className="h-5 w-5 text-blue-300" /> Starter code
        </h2>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-[#30363d] bg-[#0d1117] p-4 text-sm text-slate-200">
          <code>{project.codeExample}</code>
        </pre>
      </section>

      <section className="mt-8 rounded-2xl border border-[#30363d] bg-[#161b22]/80 p-7">
        <h2 className="text-xl font-semibold">Wiring diagram</h2>
        <div className="mt-4">
          <WiringDiagram diagram={project.wiring} />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[#30363d] bg-[#161b22]/80 p-7">
        <h2 className="text-xl font-semibold">Deliverables checklist</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          {project.deliverables.map((deliverable) => (
            <li key={deliverable} className="rounded-md border border-[#30363d] bg-[#0d1117]/70 px-3 py-2">
              {deliverable}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
