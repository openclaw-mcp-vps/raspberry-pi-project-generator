import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateProjectWithAI } from "@/lib/openai";
import { saveProject } from "@/lib/database";
import { GeneratedProject } from "@/types/project";

const schema = z.object({
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  raspberryPiModel: z.string().min(2),
  components: z.array(z.string().min(1)).min(1),
  interests: z.array(z.string().min(1)).min(1),
  availableHoursPerWeek: z.number().min(1).max(60),
  goals: z.string().min(10)
});

export async function POST(request: Request): Promise<NextResponse> {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get("rpig_paid")?.value === "1";

  if (!hasAccess) {
    return NextResponse.json({ error: "Subscription required before generating projects." }, { status: 402 });
  }

  try {
    const payload = schema.parse(await request.json());
    const generated = await generateProjectWithAI(payload);

    const project: GeneratedProject = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...generated
    };

    await saveProject(project);

    return NextResponse.json({ id: project.id });
  } catch (error) {
    console.error("generate-project failure", error);
    return NextResponse.json({ error: "Could not generate project. Please try again." }, { status: 500 });
  }
}
