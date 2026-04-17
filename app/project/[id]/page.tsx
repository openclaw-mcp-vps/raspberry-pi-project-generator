import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WiringDiagram } from "@/components/WiringDiagram";
import { getProjectById } from "@/lib/database";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: `${project.title} | Raspberry Pi Build Guide`,
    description: project.summary
  };
}

export default async function ProjectPage({ params }: ProjectPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pb-20 pt-10">
      <div className="rounded-2xl border border-[#2b3340] bg-[#111827]/80 p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-[#79c7ff]">Generated Build Guide</p>
        <h1 className="mt-3 text-3xl font-black">{project.title}</h1>
        <p className="mt-3 text-[#c5d1e3]">{project.summary}</p>
        <p className="mt-3 text-sm text-[#9aa4b2]">
          Difficulty: <span className="font-semibold text-[#f5f8ff]">{project.difficulty}</span> | Estimated time:{" "}
          <span className="font-semibold text-[#f5f8ff]">{project.estimatedBuildTime}</span>
        </p>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#2b3340] bg-[#111827]/80 p-6">
          <h2 className="text-xl font-bold">Required Components</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#d9e6fb]">
            {project.requiredComponents.map((component) => (
              <li key={component}>- {component}</li>
            ))}
          </ul>

          <h2 className="mt-8 text-xl font-bold">Learning Outcomes</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#d9e6fb]">
            {project.learningOutcomes.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </article>

        <WiringDiagram wiring={project.wiring} />
      </section>

      <section className="mt-8 rounded-2xl border border-[#2b3340] bg-[#111827]/80 p-6">
        <h2 className="text-xl font-bold">Build Steps</h2>
        <div className="mt-4 space-y-4">
          {project.steps.map((step, index) => (
            <article key={`${step.title}-${index}`} className="rounded-xl border border-[#2b3340] bg-[#0d1117] p-4">
              <h3 className="text-lg font-semibold">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-2 text-sm text-[#c8d4e5]">{step.details}</p>
              {step.codeExample ? (
                <pre className="mt-3 overflow-x-auto rounded-lg border border-[#2b3340] bg-[#0a0f15] p-3 text-xs text-[#c8f2d8]">
                  <code>{step.codeExample}</code>
                </pre>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
