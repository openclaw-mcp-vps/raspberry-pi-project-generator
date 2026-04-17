export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface GeneratorInput {
  skillLevel: SkillLevel;
  raspberryPiModel: string;
  components: string[];
  interests: string[];
  availableHoursPerWeek: number;
  goals: string;
}

export interface ProjectStep {
  title: string;
  details: string;
  codeExample?: string;
}

export interface WiringConnection {
  from: string;
  to: string;
  note: string;
}

export interface GeneratedProject {
  id: string;
  title: string;
  summary: string;
  difficulty: SkillLevel;
  estimatedBuildTime: string;
  requiredComponents: string[];
  learningOutcomes: string[];
  steps: ProjectStep[];
  wiring: WiringConnection[];
  createdAt: string;
}

export interface PurchaseRecord {
  orderId: string;
  email?: string;
  status: "paid";
  createdAt: string;
}
