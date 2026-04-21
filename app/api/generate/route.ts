import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hasPaidAccess } from "@/lib/auth";
import { generateProjectRecommendations } from "@/lib/projectGenerator";

const generateInputSchema = z.object({
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  availableComponents: z.array(z.string()).min(2),
  interests: z.array(z.string()).min(1)
});

export async function POST(request: NextRequest) {
  if (!hasPaidAccess(request.cookies)) {
    return NextResponse.json(
      {
        error: "Access requires an active subscription. Complete checkout to continue."
      },
      { status: 402 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = generateInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid generator input.",
        issues: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const recommendations = generateProjectRecommendations(parsed.data, 4);

  return NextResponse.json({
    projects: recommendations,
    generatedAt: new Date().toISOString()
  });
}
