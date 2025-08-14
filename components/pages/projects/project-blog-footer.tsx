"use client";

import { TProject } from "@/types/project";
import { Button } from "@heroui/react";
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
                        href={project.github_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        variant="bordered"
                        className="w-full sm:w-auto"
                        startContent={ICON_CONFIG.GITHUB}
                    >
                        Open on Github
                    </Button>
                )}
                {project.demo_link && (
                    <Button 
                        as="a" 
                        href={project.demo_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        color="primary"
                        className="w-full sm:w-auto"
                        startContent={ICON_CONFIG.LIVE_DEMO}
                    >
                        Live Demo
                    </Button>
                )}
            </div>
        </Container>
    );
}