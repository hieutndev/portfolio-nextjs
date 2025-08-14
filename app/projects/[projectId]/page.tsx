import { TProject } from "@/types/project";
import { nonAuthFetch } from "@/utils/non-auth-fetch";
import API_ROUTE from "@/configs/api";
import ProjectBlogHeader from "@/components/pages/projects/project-blog-header";
import ProjectBlogContent from "@/components/pages/projects/project-blog-content";
import ProjectBlogFooter from "@/components/pages/projects/project-blog-footer";
import Container from "@/components/shared/container/container";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface ProjectBlogPageProps {
    params: Promise<{ projectId: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProjectBlogPageProps): Promise<Metadata> {
    const { projectId } = await params;
    const numericProjectId = parseInt(projectId, 10);

    if (isNaN(numericProjectId)) {
        return {
            title: "Project Not Found",
            description: "The requested project could not be found.",
        };
    }

    const response = await nonAuthFetch<TProject>(
        API_ROUTE.PROJECT.GET_ONE(numericProjectId),
        {
            revalidate: 3600,
        }
    );

    if (response.status !== "success" || !response.results) {
        return {
            title: "Project Not Found",
            description: "The requested project could not be found.",
        };
    }

    const project = response.results;

    return {
        title: `${project.project_fullname} | Portfolio`,
        description: project.short_description,
        openGraph: {
            title: project.project_fullname,
            description: project.short_description,
            images: project.project_thumbnail ? [project.project_thumbnail] : [],
        },
    };
}

export default async function ProjectBlogPage({ params }: ProjectBlogPageProps) {
    const { projectId } = await params;

    // Convert projectId to number since the API expects a number
    const numericProjectId = parseInt(projectId, 10);

    if (isNaN(numericProjectId)) {
        notFound();
    }

    // Fetch project data on the server
    const response = await nonAuthFetch<TProject>(
        API_ROUTE.PROJECT.GET_ONE(numericProjectId),
        {
            // Revalidate every hour to keep data fresh
            revalidate: 3600,
        }
    );

    // Handle error cases
    if (response.status !== "success" || !response.results) {
        if (response.status === "error" && response.errors?.includes("404")) {
            notFound();
        }

        return (
            <Container className="!p-4 items-center" orientation="vertical">
                <div>Error loading project: {response.errors || 'Project not found'}</div>
            </Container>
        );
    }

    const project = response.results;

    return (
        <div className="w-full flex flex-col gap-8">
            <ProjectBlogHeader project={project} />
            <ProjectBlogContent project={project} />
            <ProjectBlogFooter project={project} />
        </div>
    );
}