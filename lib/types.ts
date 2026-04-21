export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface HardwareComponent {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface ProjectStep {
  title: string;
  detail: string;
}

export interface WiringConnection {
  from: string;
  to: string;
  color: string;
  purpose: string;
}

export interface ProjectWiringDiagram {
  notes: string;
  connections: WiringConnection[];
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  difficulty: SkillLevel;
  estimatedTime: string;
  interests: string[];
  requiredComponents: string[];
  optionalComponents: string[];
  overview: string;
  steps: ProjectStep[];
  codeExample: string;
  wiring: ProjectWiringDiagram;
  deliverables: string[];
}

export interface GeneratorInput {
  skillLevel: SkillLevel;
  availableComponents: string[];
  interests: string[];
}

export interface ProjectRecommendation extends Project {
  score: number;
  reasons: string[];
  missingComponents: string[];
  componentCoverage: number;
  interestMatch: number;
  skillFit: "great" | "stretch" | "review-basics";
}
