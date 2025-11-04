"use client";

import { Image } from "@heroui/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "hieutndev-toolkit";
import { getTimeAgoString } from "hieutndev-toolkit";

import Container from "@/components/shared/container/container";
import ICON_CONFIG from "@/configs/icons";
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
            <h1 className={"text-4xl font-extrabold"}>All Projects</h1>
            <div className={"w-full grid grid-cols-12 gap-4"}>

                {fetchProjectsResult && fetchProjectsResult.results && fetchProjectsResult.results.map((project, index) => {

                    return (
                        <button
                            key={project.id}
                            className={"col-span-12 lg:col-span-6 w-full h-auto flex flex-col justify-between gap-2 bg-gray-100/75 hover:scale-[101%] transition-all duration-200 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"}
                            onClick={() => router.push(ROUTE_PATH.CLIENT.PROJECTS.DETAILS(project.id))}
                        >
                            <div className={"w-full h-auto flex flex-col gap-4"}>
                                <div className={"w-full max-h-80 flex justify-center border"}>
                                    <Image
                                        alt={`${project.project_fullname} Thumbnail`}
                                        className={"w-full h-80 max-h-80 object-cover border-gray-200"}
                                        radius={"none"}
                                        src={project.project_thumbnail}
                                    />
                                </div>
                                <div className={"col-span-12 lg:col-span-9 flex flex-col gap-2 p-4"}>
                                    <h3 className={"text-left text-xl font-semibold"}>{project.project_fullname}</h3>
                                    <p className={"text-left"}>{sliceText(project.short_description, 75)}</p>
                                </div>

                            </div>
                            <div className={"flex items-center justify-between gap-4 text-sm px-4 pb-4"}>
                                <div className={"flex items-center gap-1 text-gray-400"}>
                                    {ICON_CONFIG.VIEW}
                                    <p className={"text-left text-sm"}>{project.views}</p>
                                </div>
                                <p className={"text-left text-xs text-gray-400"}>{getTimeAgoString(project.created_at)}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </Container >
    );
}