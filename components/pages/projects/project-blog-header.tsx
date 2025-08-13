import Container from "@/components/shared/container/container";
import { Button, Image } from "@heroui/react";
import { TProject } from "@/types/project";

interface ProjectBlogHeaderProps {
  project: TProject;
}

export default function ProjectBlogHeader({ project }: ProjectBlogHeaderProps) {
  return (
    <Container className="!p-4 items-center" orientation="vertical">
      <Button variant={"light"} className={"w-max"}>
        Back to Projects
      </Button>
      <h1
        className={
          "w-full text-wrap text-center text-primary text-3xl font-bold"
        }>
        {project.project_fullname}
      </h1>
      <p className={"text-sm italic text-center"}>
        {project.short_description}
      </p>
      <Image
        src={project.project_thumbnail}
        width={1920}
        shadow={"sm"}
        isBlurred
        alt={project.project_fullname}
      />
    </Container>
  );
}
