"use client";

import { Button } from "@heroui/react";

import { TProject } from "@/types/project";
import Container from "@/components/shared/container/container";
import ICON_CONFIG from "@/configs/icons";

interface ProjectBlogFooterProps {
  project: TProject;
}

export default function ProjectBlogFooter({ project }: ProjectBlogFooterProps) {
    return (
        <Container className="!p-4 items-center" orientation="vertical">
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
                {project.github_link && (
                    <Button 
                        as="a" 
                        className="w-full sm:w-auto" 
                        href={project.github_link} 
                        rel="noopener noreferrer"
                        startContent={ICON_CONFIG.GITHUB}
                        target="_blank"
                        variant="bordered"
                    >
                        Open on Github
                    </Button>
                )}
                {project.demo_link && (
                    <Button 
                        as="a" 
                        className="w-full sm:w-auto" 
                        color="primary" 
                        href={project.demo_link}
                        rel="noopener noreferrer"
                        startContent={ICON_CONFIG.LIVE_DEMO}
                        target="_blank"
                    >
                        Live Demo
                    </Button>
                )}
            </div>
        </Container>
    );
}