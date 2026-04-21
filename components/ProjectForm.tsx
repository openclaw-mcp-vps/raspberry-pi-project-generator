"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ProjectCard from "@/components/ProjectCard";
import type { HardwareComponent, ProjectRecommendation } from "@/lib/types";

const skillLevels = [
  {
    id: "beginner",
    label: "Beginner",
    detail: "You are still learning GPIO basics, wiring safety, and Linux setup."
  },
  {
    id: "intermediate",
    label: "Intermediate",
    detail: "You can debug common wiring/software issues and combine multiple sensors."
  },
  {
    id: "advanced",
    label: "Advanced",
    detail: "You are comfortable with multi-module builds, optimization, and automation."
  }
] as const;

const interestOptions = [
  { id: "home-automation", label: "Home automation" },
  { id: "monitoring", label: "Monitoring" },
  { id: "security", label: "Security" },
  { id: "iot", label: "IoT dashboards" },
  { id: "voice-assistant", label: "Voice control" },
  { id: "robotics", label: "Robotics" },
  { id: "photography", label: "Photography" },
  { id: "audio", label: "Audio + music" },
  { id: "gardening", label: "Smart gardening" },
  { id: "gaming", label: "Gaming builds" },
  { id: "creative-coding", label: "Creative coding" }
] as const;

const formSchema = z.object({
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  availableComponents: z
    .array(z.string())
    .min(2, "Select at least two components you currently have available."),
  interests: z.array(z.string()).min(1, "Pick at least one interest area.")
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  components: HardwareComponent[];
}

interface GenerateResponse {
  projects: ProjectRecommendation[];
  generatedAt: string;
}

export default function ProjectForm({ components }: ProjectFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<ProjectRecommendation[]>([]);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillLevel: "beginner",
      availableComponents: ["raspberry-pi", "breadboard", "jumper-wires"],
      interests: ["monitoring"]
    }
  });

  const selectedSkill = watch("skillLevel");
  const selectedComponents = watch("availableComponents");
  const selectedInterests = watch("interests");

  const groupedComponents = useMemo(() => {
    return components.reduce<Record<string, HardwareComponent[]>>((accumulator, component) => {
      accumulator[component.category] ??= [];
      accumulator[component.category].push(component);
      return accumulator;
    }, {});
  }, [components]);

  const toggleArrayValue = (field: "availableComponents" | "interests", value: string) => {
    const currentValues = watch(field);
    const hasValue = currentValues.includes(value);

    const nextValues = hasValue
      ? currentValues.filter((entry) => entry !== value)
      : [...currentValues, value];

    setValue(field, nextValues, { shouldValidate: true, shouldDirty: true });
  };

  const nextStep = async () => {
    if (step === 1) {
      const valid = await trigger("skillLevel");
      if (!valid) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      const valid = await trigger("availableComponents");
      if (!valid) return;
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 3) {
      setStep(2);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      const payload = (await response.json()) as GenerateResponse | { error?: string };

      if (!response.ok) {
        const apiError =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "Unable to generate recommendations right now.";

        setErrorMessage(apiError);
        setResults([]);
        return;
      }

      setResults((payload as GenerateResponse).projects);
    } catch {
      setErrorMessage("Network issue while generating projects. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <section className="rounded-2xl border border-[#30363d] bg-[#161b22]/85 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Project setup</h1>
        <p className="mt-2 text-sm text-slate-300">
          Complete three steps to generate high-fit Raspberry Pi projects with implementation-ready
          guidance.
        </p>

        <div className="mt-6 flex items-center gap-3 text-xs text-slate-300">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                  step >= item
                    ? "border-blue-500 bg-blue-500/20 text-blue-100"
                    : "border-[#30363d] bg-[#0d1117] text-slate-400"
                }`}
              >
                {item}
              </div>
              {item < 3 ? <div className="h-px w-10 bg-[#30363d]" /> : null}
            </div>
          ))}
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {step === 1 ? (
            <div>
              <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-slate-300">
                Step 1: Skill level
              </h2>
              <div className="mt-3 space-y-3">
                {skillLevels.map((level) => {
                  const active = selectedSkill === level.id;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setValue("skillLevel", level.id, { shouldValidate: true })}
                      className={`w-full rounded-lg border p-4 text-left transition ${
                        active
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-[#30363d] bg-[#0d1117]/70 hover:border-blue-500/40"
                      }`}
                    >
                      <p className="font-medium text-slate-100">{level.label}</p>
                      <p className="mt-1 text-sm text-slate-300">{level.detail}</p>
                    </button>
                  );
                })}
              </div>
              {errors.skillLevel ? (
                <p className="mt-2 text-sm text-red-300">{errors.skillLevel.message}</p>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-slate-300">
                Step 2: Available components
              </h2>
              <p className="mt-1 text-sm text-slate-400">Selected: {selectedComponents.length}</p>

              <div className="mt-4 space-y-4">
                {Object.entries(groupedComponents).map(([category, categoryComponents]) => (
                  <div key={category}>
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{category}</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {categoryComponents.map((component) => {
                        const selected = selectedComponents.includes(component.id);
                        return (
                          <button
                            key={component.id}
                            type="button"
                            onClick={() => toggleArrayValue("availableComponents", component.id)}
                            className={`rounded-md border p-3 text-left transition ${
                              selected
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-[#30363d] bg-[#0d1117]/70 hover:border-blue-500/30"
                            }`}
                          >
                            <p className="text-sm font-medium text-slate-100">{component.name}</p>
                            <p className="mt-1 text-xs text-slate-400">{component.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {errors.availableComponents ? (
                <p className="mt-2 text-sm text-red-300">{errors.availableComponents.message}</p>
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-slate-300">
                Step 3: Interests
              </h2>
              <p className="mt-1 text-sm text-slate-400">Selected: {selectedInterests.length}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {interestOptions.map((interest) => {
                  const selected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleArrayValue("interests", interest.id)}
                      className={`rounded-full border px-3 py-2 text-sm transition ${
                        selected
                          ? "border-blue-500 bg-blue-500/15 text-blue-100"
                          : "border-[#30363d] bg-[#0d1117]/70 text-slate-300 hover:border-blue-500/30"
                      }`}
                    >
                      {interest.label}
                    </button>
                  );
                })}
              </div>

              {errors.interests ? (
                <p className="mt-2 text-sm text-red-300">{errors.interests.message}</p>
              ) : null}
            </div>
          ) : null}

          {errorMessage ? (
            <p className="rounded-md border border-red-500/35 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="rounded-md border border-[#30363d] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-blue-500"
              >
                Back
              </button>
            ) : null}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate projects
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-[#30363d] bg-[#161b22]/85 p-6">
        <h2 className="text-2xl font-semibold tracking-tight">Recommendations</h2>
        <p className="mt-2 text-sm text-slate-300">
          You will get ranked projects with implementation steps, wiring guidance, and practical
          starter code.
        </p>

        <div className="mt-6 space-y-4">
          {results.length === 0 ? (
            <div className="rounded-lg border border-[#30363d] bg-[#0d1117]/70 p-4 text-sm text-slate-300">
              Submit the form to generate your personalized Raspberry Pi project stack.
            </div>
          ) : (
            results.map((project) => <ProjectCard key={project.id} project={project} />)
          )}
        </div>
      </section>
    </div>
  );
}
