import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ProjectForm } from "@/components/ProjectForm";
import { PaywallModal } from "@/components/PaywallModal";
import { buildCheckoutUrl } from "@/lib/lemonsqueezy";

export const metadata: Metadata = {
  title: "Project Generator | Raspberry Pi Project Generator",
  description: "Create a custom Raspberry Pi project guide tailored to your parts, goals, and skill level."
};

export default async function GeneratorPage(): Promise<React.ReactElement> {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get("rpig_paid")?.value === "1";
  const checkoutUrl = buildCheckoutUrl();

  return (
    <main className="mx-auto max-w-4xl px-6 pb-16 pt-10">
      <h1 className="text-3xl font-black">Project Generator</h1>
      <p className="mt-3 max-w-2xl text-[#9aa4b2]">
        Build a project plan that matches your current setup instead of generic tutorials. Enter your hardware and objectives to generate a complete build path.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        {hasAccess ? (
          <ProjectForm />
        ) : (
          <div className="rounded-2xl border border-[#2b3340] bg-[#111827] p-6">
            <h2 className="text-xl font-bold">Subscription required</h2>
            <p className="mt-2 text-sm text-[#9aa4b2]">
              The generator is available to subscribers so we can deliver high-quality project plans and keep improving the hardware compatibility engine.
            </p>
            <p className="mt-4 rounded-xl border border-[#2b3340] bg-[#0d1117] p-3 text-sm text-[#c8d4e5]">
              After checkout, return to this page. If Lemon Squeezy adds <code>order_id</code> to the URL, access is enabled automatically.
            </p>
          </div>
        )}
        {!hasAccess ? <PaywallModal checkoutUrl={checkoutUrl} /> : null}
      </div>
    </main>
  );
}
