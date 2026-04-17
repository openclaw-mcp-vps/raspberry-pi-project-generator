"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  raspberryPiModel: z.string().min(2, "Tell us your Pi model."),
  componentsCsv: z.string().min(3, "List at least two components."),
  interestsCsv: z.string().min(3, "List at least one interest."),
  availableHoursPerWeek: z.coerce.number().min(1).max(40),
  goals: z.string().min(20, "Describe what you want to build.")
});

type FormValues = z.infer<typeof schema>;

const steps = ["Skills", "Hardware", "Project Goals"] as const;

export function ProjectForm(): React.ReactElement {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      skillLevel: "beginner",
      raspberryPiModel: "Raspberry Pi 4 Model B",
      componentsCsv: "DHT22 sensor, PIR sensor, relay module, LED, jumper wires",
      interestsCsv: "home automation, dashboards, environmental monitoring",
      availableHoursPerWeek: 4,
      goals: "I want to build something practical that teaches GPIO and automation while staying reliable for daily use."
    }
  });

  const nextStep = async (): Promise<void> => {
    const fieldsByStep: Record<number, (keyof FormValues)[]> = {
      0: ["skillLevel"],
      1: ["raspberryPiModel", "componentsCsv"],
      2: ["interestsCsv", "availableHoursPerWeek", "goals"]
    };

    const valid = await form.trigger(fieldsByStep[step]);
    if (!valid) {
      return;
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const prevStep = (): void => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    setIsGenerating(true);

    const response = await fetch("/api/generate-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skillLevel: values.skillLevel,
        raspberryPiModel: values.raspberryPiModel,
        components: values.componentsCsv.split(",").map((item) => item.trim()).filter(Boolean),
        interests: values.interestsCsv.split(",").map((item) => item.trim()).filter(Boolean),
        availableHoursPerWeek: values.availableHoursPerWeek,
        goals: values.goals
      })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({ error: "Failed to generate project." }))) as {
        error?: string;
      };
      setError(payload.error ?? "Failed to generate project.");
      setIsGenerating(false);
      return;
    }

    const payload = (await response.json()) as { id: string };
    router.push(`/project/${payload.id}`);
    router.refresh();
  });

  return (
    <Card>
      <CardHeader>
        <div className="mb-2 inline-flex items-center gap-2 text-[#4db2ff]">
          <Sparkles size={16} />
          <span className="text-sm font-semibold">Step {step + 1} of {steps.length}</span>
        </div>
        <CardTitle>{steps[step]}</CardTitle>
        <CardDescription>We use your input to generate a realistic project that fits your hardware and learning goals.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {step === 0 ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Current skill level</label>
              <select
                className="h-11 w-full rounded-xl border border-[#2b3340] bg-[#0d1117] px-3 text-sm"
                {...form.register("skillLevel")}
              >
                <option value="beginner">Beginner - New to electronics</option>
                <option value="intermediate">Intermediate - Comfortable with GPIO and scripts</option>
                <option value="advanced">Advanced - Build custom integrations</option>
              </select>
              <p className="text-xs text-[#9aa4b2]">Pick the level that reflects your current confidence with hardware and code.</p>
            </div>
          ) : null}

          {step === 1 ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Raspberry Pi model</label>
                <Input {...form.register("raspberryPiModel")} placeholder="Raspberry Pi 5 8GB" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Available components</label>
                <Textarea
                  {...form.register("componentsCsv")}
                  placeholder="Comma-separated list: camera module, relay board, OLED display..."
                />
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Interests</label>
                <Input {...form.register("interestsCsv")} placeholder="robotics, smart home, security" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hours available per week</label>
                <Input type="number" min={1} max={40} {...form.register("availableHoursPerWeek")} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">What do you want this project to achieve?</label>
                <Textarea {...form.register("goals")} />
              </div>
            </>
          ) : null}

          {Object.values(form.formState.errors).length > 0 ? (
            <p className="text-sm text-[#ff7f7f]">{Object.values(form.formState.errors)[0]?.message as string}</p>
          ) : null}

          {error ? <p className="text-sm text-[#ff7f7f]">{error}</p> : null}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0 || isGenerating}>
              Back
            </Button>

            {step < steps.length - 1 ? (
              <Button type="button" className="ml-auto" onClick={nextStep}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="ml-auto" disabled={isGenerating}>
                {isGenerating ? "Generating your project..." : "Generate My Project"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
