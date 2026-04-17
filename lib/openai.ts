import OpenAI from "openai";
import { GeneratorInput, GeneratedProject } from "@/types/project";

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function buildFallbackProject(input: GeneratorInput): Omit<GeneratedProject, "id" | "createdAt"> {
  const primaryInterest = input.interests[0] ?? "home automation";
  const title = `Smart ${primaryInterest} Dashboard for ${input.raspberryPiModel}`;

  return {
    title,
    summary:
      "A practical weekend build that collects real sensor data, displays it on a local web dashboard, and adds alert automation so you can grow the project over time.",
    difficulty: input.skillLevel,
    estimatedBuildTime: `${Math.max(4, input.availableHoursPerWeek)}-10 hours`,
    requiredComponents: [
      "Raspberry Pi power supply",
      "Breadboard + jumper wires",
      ...input.components.slice(0, 5)
    ],
    learningOutcomes: [
      "GPIO pin mapping and safe wiring habits",
      "Building a Python or Node data collection loop",
      "Creating a responsive local dashboard with charts",
      "Adding basic automation and fail-safe behavior"
    ],
    steps: [
      {
        title: "Prepare the Pi and dependencies",
        details:
          "Flash Raspberry Pi OS, enable SSH, update apt packages, and install libraries for GPIO, chart rendering, and your selected sensor modules.",
        codeExample: "sudo apt update && sudo apt upgrade -y\npython3 -m pip install gpiozero flask"
      },
      {
        title: "Wire the components and validate readings",
        details:
          "Connect power and signal pins based on each module's voltage requirements. Validate each sensor independently before combining into one script.",
        codeExample: "from gpiozero import CPUTemperature\nprint(CPUTemperature().temperature)"
      },
      {
        title: "Build the dashboard service",
        details:
          "Create an API endpoint on the Pi that serves latest readings every few seconds. Render values and trends in a simple dashboard UI.",
        codeExample: "app.get('/api/status', (_, res) => res.json({ temp, humidity, updatedAt: Date.now() }))"
      },
      {
        title: "Add automation and notifications",
        details:
          "Define threshold rules to trigger LEDs, buzzer alerts, or webhook notifications, then run your service with systemd for auto-restart.",
        codeExample:
          "if humidity > 70:\n    trigger_fan()\n    send_alert('Humidity threshold exceeded')"
      }
    ],
    wiring: [
      { from: "Pi 3.3V", to: "Sensor VCC", note: "Use 3.3V-safe modules to protect GPIO." },
      { from: "Pi GND", to: "Sensor GND", note: "All modules must share a common ground." },
      { from: "Pi GPIO17", to: "Sensor DATA", note: "Change pin in code to match your wiring." },
      { from: "Pi GPIO27", to: "LED resistor + anode", note: "Use 220R resistor to limit current." }
    ]
  };
}

export async function generateProjectWithAI(
  input: GeneratorInput
): Promise<Omit<GeneratedProject, "id" | "createdAt">> {
  if (!client) {
    return buildFallbackProject(input);
  }

  const prompt = `You are an expert Raspberry Pi educator. Create one realistic project for this user:
- Skill: ${input.skillLevel}
- Pi model: ${input.raspberryPiModel}
- Components: ${input.components.join(", ")}
- Interests: ${input.interests.join(", ")}
- Hours per week: ${input.availableHoursPerWeek}
- Goal: ${input.goals}

Return strict JSON with keys:
{
  "title": string,
  "summary": string,
  "difficulty": "beginner" | "intermediate" | "advanced",
  "estimatedBuildTime": string,
  "requiredComponents": string[],
  "learningOutcomes": string[],
  "steps": [{"title": string, "details": string, "codeExample": string}],
  "wiring": [{"from": string, "to": string, "note": string}]
}
Ensure the project is feasible with listed components and includes practical code examples.`;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    temperature: 0.5
  });

  const raw = response.output_text.trim();
  const parsed = JSON.parse(raw) as Omit<GeneratedProject, "id" | "createdAt">;
  return parsed;
}
