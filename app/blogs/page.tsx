"use client";

import { Image } from "@heroui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "hieutndev-toolkit";
import { getTimeAgoString } from "hieutndev-toolkit";

import Container from "@/components/shared/container/container";
import ICON_CONFIG from "@/configs/icons";
import { IAPIResponse } from "@/types/global";
import { TBlogResponse } from "@/types/blog";
import API_ROUTE from "@/configs/api";
import { sliceText } from "@/utils/string";
import ROUTE_PATH from "@/configs/route-path";


export default function BlogsPage() {

    const { data: fetchBlogsResult, error: fetchBlogsError } = useFetch<IAPIResponse<TBlogResponse[]>>(API_ROUTE.BLOG.GET_ALL)

    const router = useRouter();
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

    const handleImageError = (blogId: number) => {
        setImageErrors(prev => ({ ...prev, [blogId]: true }));
    };

    useEffect(() => {

        if (fetchBlogsError) {
            console.error("Failed to fetch blogs list on client:", fetchBlogsError);
        }

    }, [fetchBlogsResult, fetchBlogsError]);

    return (
        <Container className={"min-h-screen w-full"} orientation={"vertical"}>
            <h1 className={"text-4xl font-extrabold"}>All Blog Posts</h1>
            <div className={"w-full grid lg:grid-cols-2 grid-cols-1 gap-4"}>
                {fetchBlogsResult && fetchBlogsResult.results && fetchBlogsResult.results.map((blog) => {
                    return (
                        <button
                            key={blog.id}
                            className={"col-span-1 w-full h-auto flex flex-col justify-between bg-gray-100/75 hover:scale-[101%] transition-all duration-200 shadow-[0_3px_10px_rgb(0,0,0,0.15)]"}
                            onClick={() => router.push(ROUTE_PATH.CLIENT.BLOGS.DETAILS(blog.slug))}
                        >
                            <div className={"w-full h-auto flex flex-col gap-4"}>
                                <div className={"w-full max-h-80 flex justify-center border"}>
                                    <Image
                                        alt={`${blog.title} Thumbnail`}
                                        className={"w-full h-80 max-h-80 object-cover border-gray-200"}
                                        radius={"none"}
                                        src={blog.featured_image ? blog.featured_image : "/black_icon_board.png"}
                                    />
                                </div>
                                <div className={"col-span-12 lg:col-span-9 flex flex-col gap-2 px-4 py-2"}>
                                    <h3 className={"text-left text-xl font-semibold"}>{blog.title}</h3>
                                    <p className={"text-left"}>{sliceText(blog.excerpt, 75)}</p>
                                </div>

                            </div>
                            <div className={"flex items-center justify-between gap-4 text-sm px-4 pb-4"}>
                                <div className={"flex items-center gap-1 text-gray-400"}>
                                    {ICON_CONFIG.VIEW}
                                    <p className={"text-left text-sm"}>{blog.views}</p>
                                </div>
                                <p className={"text-left text-xs text-gray-400"}>{getTimeAgoString(blog.published_date)}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </Container >
    );
}
