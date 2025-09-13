"use client";

import { Image } from "@heroui/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/shared/container/container";
import ICON_CONFIG from "@/configs/icons";
import { getLastTimeString } from "@/utils/date";
import { useFetch } from "@/hooks/useFetch";
import { IAPIResponse } from "@/types/global";
import { TProjectResponse } from "@/types/project";
import API_ROUTE from "@/configs/api";
import { sliceText } from "@/utils/string";
import ROUTE_PATH from "@/configs/route-path";


export default function ProjectsPage() {

    const { data: fetchProjectsResult, error: fetchProjectsError } = useFetch<IAPIResponse<TProjectResponse[]>>(API_ROUTE.PROJECT.GET_ALL)

    const router = useRouter();

    useEffect(() => {

        if (fetchProjectsError) {
            console.error("Failed to fetch projects list on client:", fetchProjectsError);
        }

    }, [fetchProjectsResult, fetchProjectsError]);

    return (
        <Container className={"min-h-screen w-full"} orientation={"vertical"}>
            <h1 className={"text-4xl font-bold"}>My Projects & Blogs</h1>
            <div className={"w-full grid grid-cols-12 gap-6"}>

                {fetchProjectsResult && fetchProjectsResult.results && fetchProjectsResult.results.map((project, index) => {
                    // Featured (latest) project
                    if (index === 0) {
                        return (
                            <button key={project.id}
                                className={"col-span-12 lg:col-span-12 lg:row-span-1 h-full overflow-hidden bg-white/0 grid grid-cols-12"}
                                onClick={() => router.push(ROUTE_PATH.CLIENT.PROJECT.DETAILS(project.slug))}
                            >
                                <div className={"col-span-8 w-full"}>
                                    <Image
                                        alt={`${project.project_fullname} Thumbnail`}
                                        className={"w-full h-max object-cover border border-gray-200"}
                                        isZoomed={true}
                                        radius={"none"}
                                        src={project.project_thumbnail}
                                        width={1200}
                                    />
                                </div>
                                <div className={"col-span-4 p-4 w-full h-full"}>
                                    {/* <Chip className={""} size={"lg"}>
                                        {project.group_title}
                                    </Chip> */}

                                    {/* Bottom half overlay */}
                                    <div className={"w-full flex flex-col justify-end gap-4"}>
                                        <h2 className={"text-3xl font-bold leading-tight"}>{project.project_fullname}</h2>
                                        <p className={"text-sm"}>{sliceText(project.short_description, 140)}</p>

                                        <div className={"flex items-center justify-between gap-4 text-sm"}>
                                            <div className={"flex items-center gap-1 text-gray-400"}>
                                                {ICON_CONFIG.VIEW}
                                                <p className={"text-sm"}>{project.views}</p>
                                            </div>
                                            <p className={"text-xs text-gray-400"}>{getLastTimeString(project.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        )
                    }

                    return (
                        <button
                            key={project.id}
                            className={"col-span-12 lg:col-span-4 w-full h-auto flex flex-col justify-between gap-2"}
                            onClick={() => router.push(ROUTE_PATH.CLIENT.PROJECT.DETAILS(project.id))}
                        >
                            <div className={"w-full h-auto flex flex-col gap-4"}>
                                <Image
                                    alt={`${project.project_fullname} Thumbnail`}
                                    className={"w-full object-cover border border-gray-200"}
                                    isZoomed={true}
                                    radius={"none"}
                                    src={project.project_thumbnail}
                                />
                                <div className={"col-span-12 lg:col-span-9 flex flex-col gap-2"}>
                                    <h3 className={"text-xl font-semibold"}>{project.project_fullname}</h3>
                                    <p className={""}>{sliceText(project.short_description, 50)}</p>
                                </div>

                            </div>
                            <div className={"flex items-center justify-between gap-4 text-sm"}>
                                <div className={"flex items-center gap-1 text-gray-400"}>
                                    {ICON_CONFIG.VIEW}
                                    <p className={"text-sm"}>{project.views}</p>
                                </div>
                                <p className={"text-xs text-gray-400"}>{getLastTimeString(project.created_at)}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </Container >
    );
}