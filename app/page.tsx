import Link from "next/link";
import { Lightbulb, Microchip, Route, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage(): React.ReactElement {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
      <header className="rounded-3xl border border-[#2b3340] bg-[#111827]/90 p-6 sm:p-10">
        <p className="inline-flex rounded-full border border-[#2f3f56] bg-[#14233a] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#9fd3ff]">
          Maker Tools
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
          Generate personalized Raspberry Pi project ideas you can actually build with your current parts.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[#b7c2d2]">
          Stop wasting weekends on tutorials that require hardware you do not own. Describe your skill level, parts bin, and interests, then get a practical build plan with wiring map and starter code.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/generator">
            <Button size="lg">Generate My First Project</Button>
          </Link>
          <a href="#pricing">
            <Button size="lg" variant="outline">
              View Pricing
            </Button>
          </a>
        </div>
      </header>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Wrench,
            title: "Problem",
            text: "Most tutorials assume a different sensor pack, different Pi model, or prior Linux experience, so projects fail before they start."
          },
          {
            icon: Lightbulb,
            title: "Solution",
            text: "This generator creates one project tailored to your setup, with realistic scope, exact wiring guidance, and implementation steps."
          },
          {
            icon: Route,
            title: "Outcome",
            text: "You spend your limited build time making progress instead of hunting through forums and disconnected video walkthroughs."
          }
        ].map((item) => (
          <article key={item.title} className="rounded-2xl border border-[#2b3340] bg-[#111827]/70 p-6">
            <item.icon className="mb-4 text-[#4db2ff]" />
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p className="mt-2 text-sm text-[#9aa4b2]">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-14 rounded-3xl border border-[#2b3340] bg-[#111827]/70 p-6 sm:p-10">
        <h2 className="text-3xl font-bold">What you get inside the generator</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            {
              icon: Microchip,
              title: "Component-aware planning",
              text: "Projects are generated around your exact sensors, relays, displays, and available peripherals."
            },
            {
              icon: Route,
              title: "Step-by-step build sequence",
              text: "Clear execution plan from setup to test to deployment, with practical checkpoints."
            },
            {
              icon: ShieldCheck,
              title: "Wiring confidence",
              text: "Pin-to-pin wiring map with notes to avoid common GPIO mistakes and power issues."
            },
            {
              icon: Lightbulb,
              title: "Useful code examples",
              text: "Starter snippets for data reading, control logic, and service setup to reduce trial and error."
            }
          ].map((feature) => (
            <div key={feature.title} className="rounded-xl border border-[#2b3340] bg-[#0d1117] p-5">
              <feature.icon className="mb-3 text-[#00d084]" size={18} />
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-[#9aa4b2]">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mt-14 rounded-3xl border border-[#345f45] bg-[#0f2018] p-6 sm:p-10">
        <h2 className="text-3xl font-bold">Simple pricing for makers</h2>
        <p className="mt-3 max-w-2xl text-[#c8f2d8]">
          For less than the cost of a single misplaced sensor order, you get a project planner that fits your hardware and experience every time.
        </p>
        <div className="mt-6 inline-block rounded-2xl border border-[#3f7a54] bg-[#112c1f] p-6">
          <p className="text-4xl font-black">$7/mo</p>
          <p className="mt-2 text-sm text-[#9fd8b5]">Unlimited generated projects, wiring diagrams, and code snippets.</p>
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-[#2b3340] bg-[#111827]/70 p-6 sm:p-10">
        <h2 className="text-3xl font-bold">FAQ</h2>
        <div className="mt-6 space-y-5">
          <div>
            <h3 className="font-semibold">Will this work for complete beginners?</h3>
            <p className="mt-1 text-sm text-[#9aa4b2]">
              Yes. Select beginner skill level and the generator chooses manageable projects with safe wiring and foundational code.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Can I use random parts I already have?</h3>
            <p className="mt-1 text-sm text-[#9aa4b2]">
              Yes. Enter your components and the output prioritizes ideas that fit your current inventory.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Do I get code and wiring details?</h3>
            <p className="mt-1 text-sm text-[#9aa4b2]">
              Every generated project includes implementation steps, runnable code examples, and a visual wiring map.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
