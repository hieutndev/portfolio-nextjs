import { TProject } from "@/types/project";
import { Button } from "@heroui/react";
import Container from "@/components/shared/container/container";

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
                    >
                        View on GitHub
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
                    >
                        Live Demo
                    </Button>
                )}
            </div>
            {(project.start_date || project.end_date) && (
                <div className="text-sm text-gray-600 text-center mt-4">
                    {project.start_date && (
                        <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
                    )}
                    {project.start_date && project.end_date && <span> • </span>}
                    {project.end_date && (
                        <span>Completed: {new Date(project.end_date).toLocaleDateString()}</span>
                    )}
                </div>
            )}
        </Container>
    );
}