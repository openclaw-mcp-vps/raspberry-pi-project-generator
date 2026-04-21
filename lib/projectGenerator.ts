import componentsData from "@/data/components.json";
import projectsData from "@/data/projects.json";
import type {
  GeneratorInput,
  HardwareComponent,
  Project,
  ProjectRecommendation,
  SkillLevel
} from "@/lib/types";

const projects = projectsData as Project[];
const components = componentsData as HardwareComponent[];

const componentNameById = new Map(components.map((component) => [component.id, component.name]));

const skillRank: Record<SkillLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getComponentName(id: string): string {
  return componentNameById.get(id) ?? id;
}

function getReadableList(values: string[]): string {
  if (values.length === 0) {
    return "";
  }

  if (values.length === 1) {
    return values[0];
  }

  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

function getSkillFit(
  userSkill: SkillLevel,
  projectDifficulty: SkillLevel
): ProjectRecommendation["skillFit"] {
  const gap = skillRank[userSkill] - skillRank[projectDifficulty];

  if (gap >= 0) {
    return "great";
  }

  if (gap === -1) {
    return "stretch";
  }

  return "review-basics";
}

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getAllComponents(): HardwareComponent[] {
  return components;
}

export function generateProjectRecommendations(
  input: GeneratorInput,
  limit = 4
): ProjectRecommendation[] {
  const availableSet = new Set(input.availableComponents);
  const interestsSet = new Set(input.interests);

  const recommendations = projects.map((project) => {
    const requiredOwned = project.requiredComponents.filter((component) => availableSet.has(component));
    const requiredMissing = project.requiredComponents.filter(
      (component) => !availableSet.has(component)
    );
    const optionalOwned = project.optionalComponents.filter((component) => availableSet.has(component));

    const requiredCoverage =
      project.requiredComponents.length === 0
        ? 1
        : requiredOwned.length / project.requiredComponents.length;

    const optionalCoverage =
      project.optionalComponents.length === 0
        ? 0
        : optionalOwned.length / project.optionalComponents.length;

    const componentCoverage = clamp(requiredCoverage * 0.85 + optionalCoverage * 0.15, 0, 1);

    const matchingInterests = project.interests.filter((interest) => interestsSet.has(interest));
    const interestMatch =
      project.interests.length === 0 ? 0 : matchingInterests.length / project.interests.length;

    const difficultyGap = skillRank[input.skillLevel] - skillRank[project.difficulty];
    const skillScore =
      difficultyGap >= 0
        ? 22 + clamp((2 - difficultyGap) * 3, 0, 6)
        : clamp(22 + difficultyGap * 10, 3, 20);

    const componentScore =
      componentCoverage * 58 + (requiredMissing.length === 0 ? 6 : clamp(4 - requiredMissing.length * 2, 0, 4));

    const interestScore = interestMatch * 22;

    const score = Math.round(clamp(skillScore + componentScore + interestScore, 1, 100));

    const reasons: string[] = [];

    if (requiredMissing.length === 0) {
      reasons.push("You already have all required components for this build.");
    } else {
      const missingNames = requiredMissing.map((id) => getComponentName(id));
      reasons.push(`You only need ${getReadableList(missingNames)} to complete this setup.`);
    }

    if (matchingInterests.length > 0) {
      reasons.push(`Matches your interests in ${getReadableList(matchingInterests)}.`);
    }

    const skillFit = getSkillFit(input.skillLevel, project.difficulty);

    if (skillFit === "great") {
      reasons.push("Difficulty is aligned with your current experience level.");
    } else if (skillFit === "stretch") {
      reasons.push("This is a solid stretch project with manageable complexity.");
    } else {
      reasons.push("Advanced build: review fundamentals before starting this one.");
    }

    return {
      ...project,
      score,
      reasons,
      missingComponents: requiredMissing,
      componentCoverage,
      interestMatch,
      skillFit
    } satisfies ProjectRecommendation;
  });

  return recommendations.sort((a, b) => b.score - a.score).slice(0, clamp(limit, 1, 8));
}
