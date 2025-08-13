import ProjectBlog from "@/components/pages/projects/project-blog";
import { TProject } from "@/types/project";

interface ProjectBlogPageProps {
    params: Promise<{ projectId: TProject["id"] }>;
}

export default async function ProjectBlogPage({ params }: ProjectBlogPageProps) {
    const { projectId } = await params;

    return (
        <ProjectBlog projectId={projectId} />
    )
}