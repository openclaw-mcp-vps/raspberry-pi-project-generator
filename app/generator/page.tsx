import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Lock, Rocket } from "lucide-react";
import ProjectForm from "@/components/ProjectForm";
import componentsData from "@/data/components.json";
import { hasPaidAccess } from "@/lib/auth";
import type { HardwareComponent } from "@/lib/types";

export const metadata: Metadata = {
  title: "Project Generator",
  description:
    "Generate Raspberry Pi projects tailored to your skill level, available components, and interests."
};

export const dynamic = "force-dynamic";

export default async function GeneratorPage() {
  const cookieStore = await cookies();
  const paidAccess = hasPaidAccess(cookieStore);

  if (!paidAccess) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-3xl px-5 py-16 sm:px-8">
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22]/85 p-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-blue-200">
            <Lock className="h-3.5 w-3.5" />
            Subscriber Access
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Unlock the project generator</h1>
          <p className="mt-3 text-slate-300">
            Full project matching is available for subscribers. Purchase through Stripe Checkout,
            then return to activate your access cookie.
          </p>

          <div className="mt-8 rounded-xl border border-[#30363d] bg-[#0d1117]/85 p-5">
            <h2 className="font-medium text-slate-100">Activation steps</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
              <li>Complete checkout using the Stripe hosted payment link.</li>
              <li>
                Configure the Stripe payment link completion redirect to
                <code className="ml-1 rounded bg-slate-800 px-1 py-0.5">/api/access?purchase=complete</code>
                so access is granted automatically.
              </li>
              <li>If you just paid, use the activation button below.</li>
            </ol>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Buy for $7/mo
            </a>
            <a
              href="/api/access?purchase=complete"
              className="inline-flex items-center justify-center rounded-md border border-[#30363d] px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-blue-500"
            >
              I Completed Checkout
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-[#30363d] px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-500"
            >
              Back to landing page
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-5 py-10 sm:px-8">
      <div className="mb-8 rounded-xl border border-blue-500/35 bg-blue-500/10 p-4 text-sm text-blue-100">
        <p className="inline-flex items-center gap-2">
          <Rocket className="h-4 w-4" />
          Access unlocked. Build a project plan that matches your exact Raspberry Pi setup.
        </p>
      </div>

      <ProjectForm components={componentsData as HardwareComponent[]} />
    </main>
  );
}
