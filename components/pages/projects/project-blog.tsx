"use client"

import { TProject } from "@/types/project";
import ProjectBlogHeader from "./project-blog-header";
import ProjectBlogContent from "./project-blog-content";
import ProjectBlogFooter from "./project-blog-footer";
import { useFetch } from "@/hooks/useFetch";
import API_ROUTE from "@/configs/api";
import { IAPIResponse } from "@/types/global";
import Container from "@/components/shared/container/container";

interface ProjectBlogProps {
    projectId: TProject["id"];
}

export default function ProjectBlog({projectId}: ProjectBlogProps) {

    const { data, loading, error } = useFetch<IAPIResponse<TProject>>(API_ROUTE.PROJECT.GET_ONE(projectId));

    if (loading) {
        return (
            <Container className="!p-4 items-center" orientation="vertical">
                <div>Loading project...</div>
            </Container>
        );
    }

    if (error || data?.status !== "success" || !data?.results) {
        return (
            <Container className="!p-4 items-center" orientation="vertical">
                <div>Error loading project: {error || 'Project not found'}</div>
            </Container>
        );
    }

    const project = data.results;

    return (
        <div className="w-full flex flex-col gap-8">
            <ProjectBlogHeader project={project} />
            <ProjectBlogContent project={project} />
            <ProjectBlogFooter project={project} />
        </div>
    );
}