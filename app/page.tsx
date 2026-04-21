import Link from "next/link";
import {
  CircuitBoard,
  Cpu,
  Hammer,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Wrench
} from "lucide-react";
import { getAllProjects } from "@/lib/projectGenerator";

const painPoints = [
  "Most guides assume hardware you do not own.",
  "Beginner tutorials often skip real troubleshooting steps.",
  "Advanced projects jump too quickly into fragile setups.",
  "Searching forums and videos burns hours before you even start wiring."
];

const solutionPillars = [
  {
    title: "Hardware-aware matching",
    detail: "Recommendations are scored based on the exact components in your bin.",
    icon: Wrench
  },
  {
    title: "Skill-level calibration",
    detail: "Projects are filtered to avoid impossible leaps while still challenging you.",
    icon: TimerReset
  },
  {
    title: "Step-by-step execution",
    detail: "Every result includes wiring guidance, setup steps, and runnable code snippets.",
    icon: CircuitBoard
  }
];

const faqs = [
  {
    question: "Does this work if I only have a basic starter kit?",
    answer:
      "Yes. The generator prioritizes projects that match common starter components and clearly tells you what is missing for better results."
  },
  {
    question: "Can I use this with any Raspberry Pi model?",
    answer:
      "Yes. Recommendations focus on GPIO-compatible workflows and call out model-specific notes when needed."
  },
  {
    question: "Do I get copy-paste code or just ideas?",
    answer:
      "You get practical starter code, implementation steps, and wiring references so you can build immediately."
  },
  {
    question: "How does billing work?",
    answer:
      "It is a flat $7/month subscription through Stripe hosted checkout. Cancel anytime."
  }
];

export default function LandingPage() {
  const showcasedProjects = getAllProjects().slice(0, 3);

  return (
    <main className="min-h-screen text-slate-100">
      <header className="border-b border-[#30363d]/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Cpu className="h-5 w-5 text-blue-400" aria-hidden="true" />
            <span>Raspberry Pi Project Generator</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/generator"
              className="rounded-md border border-[#30363d] px-3 py-2 text-sm text-slate-200 transition hover:border-blue-500 hover:text-white"
            >
              Open Generator
            </Link>
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Buy for $7/mo
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-200">
              <Sparkles className="h-4 w-4" />
              Personalized maker ideas in minutes
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Generate personalized Raspberry Pi project ideas
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
              Tell us your experience level, available components, and interests. Get project
              recommendations you can actually build now, with step-by-step guides, code examples,
              and wiring diagrams.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/generator"
                className="rounded-md bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
              >
                Start Generating Projects
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-[#30363d] px-5 py-3 font-medium text-slate-100 transition hover:border-blue-500"
              >
                Unlock Full Access
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-[#30363d] bg-[#161b22]/80 p-6 shadow-2xl shadow-black/25">
            <h2 className="text-xl font-semibold">Why makers subscribe</h2>
            <ul className="mt-5 space-y-4 text-sm text-slate-300">
              {painPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-[#30363d]/80 bg-[#161b22]/60">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <h2 className="text-2xl font-semibold tracking-tight">What you get</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {solutionPillars.map((pillar) => (
              <article key={pillar.title} className="rounded-xl border border-[#30363d] bg-[#0d1117]/80 p-5">
                <pillar.icon className="h-5 w-5 text-blue-300" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-medium">{pillar.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{pillar.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight">Example project matches</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {showcasedProjects.map((project) => (
            <article key={project.id} className="rounded-xl border border-[#30363d] bg-[#161b22]/70 p-5">
              <p className="text-xs uppercase tracking-wide text-blue-300">{project.difficulty}</p>
              <h3 className="mt-2 text-lg font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{project.summary}</p>
              <p className="mt-4 text-xs text-slate-400">Build time: {project.estimatedTime}</p>
              <Link
                href={`/project/${project.id}`}
                className="mt-4 inline-flex text-sm font-medium text-blue-300 transition hover:text-blue-200"
              >
                View project details
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-y border-[#30363d]/80 bg-[#161b22]/60">
        <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
          <div className="rounded-2xl border border-blue-500/35 bg-[#0d1117] p-8 text-center shadow-lg shadow-blue-900/20">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Maker Plan</p>
            <h2 className="mt-2 text-3xl font-semibold">$7/month</h2>
            <p className="mt-3 text-slate-300">
              Unlimited project generation, practical guides, and component-aware recommendations.
            </p>
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500"
            >
              Buy Now with Stripe Checkout
            </a>
            <p className="mt-3 text-xs text-slate-400">Hosted checkout. No embedded payment form.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
        <div className="mt-6 space-y-4">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-xl border border-[#30363d] bg-[#161b22]/70 p-5">
              <h3 className="font-medium">{faq.question}</h3>
              <p className="mt-2 text-sm text-slate-300">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#30363d]/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Raspberry Pi Project Generator</p>
          <p className="flex items-center gap-2">
            <Hammer className="h-4 w-4" aria-hidden="true" />
            Built for hobbyists who want to ship real projects faster
          </p>
        </div>
      </footer>
    </main>
  );
}
