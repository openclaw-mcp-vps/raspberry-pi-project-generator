import Link from "next/link";
import { ArrowUpRight, Clock4, Cpu } from "lucide-react";
import { GeneratedProject } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectCardProps {
  project: GeneratedProject;
}

export function ProjectCard({ project }: ProjectCardProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <div className="mb-3 flex items-center justify-between gap-3">
          <Badge>{project.difficulty}</Badge>
          <span className="inline-flex items-center gap-2 text-sm text-[#9aa4b2]">
            <Clock4 size={15} /> {project.estimatedBuildTime}
          </span>
        </div>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription className="mt-2">{project.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-5 flex items-start gap-2 text-sm text-[#9aa4b2]">
          <Cpu size={16} className="mt-0.5 text-[#4db2ff]" />
          <p>{project.requiredComponents.slice(0, 4).join(", ")}</p>
        </div>
        <Link href={`/project/${project.id}`}>
          <Button className="w-full justify-center" size="lg">
            Open Full Build Guide <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
