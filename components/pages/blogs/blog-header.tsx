"use client";

import { Avatar, Chip, Image } from "@heroui/react";
import { convertSecondsToTimeString } from "hieutndev-toolkit";

import Container from "@/components/shared/container/container";
import { TBlogResponse } from "@/types/blog";
import { formatDate, getTimeAgoString } from "@/utils/date";
import ICON_CONFIG from "@/configs/icons";

interface BlogHeaderProps {
    blog: TBlogResponse;
}

export default function BlogHeader({ blog }: BlogHeaderProps) {

    const calculateReadingTime = (content: string): number => {
        const wordsPerSecond = 200 / 60; // Average reading speed
        const words = content.trim().split(/\s+/).length;

        return Math.ceil(words / wordsPerSecond);
    }

    return (
        <Container gapSize={8} orientation="vertical">
            <div className={"flex flex-col gap-4"}>
                <h1
                    className={
                        "w-full text-wrap text-left text-6xl font-extrabold leading-tight tracking-tight"
                    }>
                    {blog.title}
                </h1>
                <p className={"w-5/6 text-sm text-left"}>{blog.excerpt}</p>
                <div className={"flex justify-between items-center gap-4"}>
                    <div className="h-full flex items-center gap-4">
                        <Avatar isBordered={true} size={"sm"} src={"/avatar.jpg"} />
                        <p className={"h-full flex items-center pr-4 border-r border-gray-200"}>Tran Ngoc Hieu</p>
                        {blog.updated_at !== blog.created_at && (
                            <p className={"pr-4 border-r border-gray-200"}>
                                Updated at {getTimeAgoString(blog.updated_at)}
                            </p>
                        )}
                        {blog.updated_at === blog.created_at && (
                            <p className={"h-full flex items-center pr-4 border-r border-gray-200"}>
                                Posted on {formatDate(blog.published_date, "onlyDate")}
                            </p>
                        )}
                        <div className={"pr-4 flex items-center h-full border-r border-gray-200"}>
                            {ICON_CONFIG.TIMER}
                            <p>{convertSecondsToTimeString(calculateReadingTime(blog.content), "hms")} min read</p>
                        </div>
                        <div className={"flex items-center justify-start gap-1 text-gray-400"}>
                            {ICON_CONFIG.VIEW}
                            <p>{blog.views}</p>
                        </div>
                        {blog.category_title && (
                            <div className={"pl-4 flex items-center h-full border-l border-gray-200"}>
                                <Chip className={"border-l border-gray-200"}>
                                    {blog.category_title}
                                </Chip>
                            </div>
                        )}
                    </div>
                    {blog.published_status && (
                        <Chip className="capitalize"
                            color={blog.published_status === "published" ? "success" : blog.published_status === "archived" ? "secondary" : "warning"}
                        >
                            {blog.published_status}
                        </Chip>
                    )}
                </div>

            </div>
            {blog.featured_image && (
                <Image
                    isBlurred
                    alt={blog.title}
                    className={"min-h-[540px] rounded-none border-0"}
                    radius={"none"}
                    shadow={"sm"}
                    src={blog.featured_image}
                    width={1920}
                />
            )}
        </Container>
    );
}
