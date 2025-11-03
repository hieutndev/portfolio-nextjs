import { notFound } from "next/navigation";
import { Metadata } from "next";
import { serverFetch } from "hieutndev-toolkit";

import { TBlogResponse } from "@/types/blog";
import API_ROUTE from "@/configs/api";
import { IAPIResponse } from "@/types/global";
import BlogContent from "@/components/pages/blogs/blog-content";
import BlogFooter from "@/components/pages/blogs/blog-footer";
import BlogHeader from "@/components/pages/blogs/blog-header";
import Container from "@/components/shared/container/container";
import { Divider } from "@heroui/react";

interface BlogPageProps {
    params: Promise<{ blogId: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
    const { blogId } = await params;

    // Try to fetch blog by ID or slug
    const response = await serverFetch<IAPIResponse<TBlogResponse>>(
        API_ROUTE.BLOG.GET_ONE(blogId),
        {
            revalidate: 3600,
        }
    );

    if (response.status !== "success" || !response.results) {
        return {
            title: "Blog Post Not Found",
            description: "The requested blog post could not be found.",
        };
    }

    const blog = response.results;

    return {
        title: `${blog.title} | Blog`,
        description: blog.excerpt,
        openGraph: {
            title: blog.title,
            description: blog.excerpt,
            images: blog.featured_image ? [blog.featured_image] : [],
            type: 'article',
            publishedTime: blog.published_date,
        },
    };
}

export default async function BlogPage({ params }: BlogPageProps) {
    const { blogId } = await params;

    // Fetch blog data on the server (handles both ID and slug)
    const response = await serverFetch<IAPIResponse<TBlogResponse>>(
        API_ROUTE.BLOG.GET_ONE(blogId),
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
                <div>Error loading blog post: {response.errors || 'Blog post not found'}</div>
            </Container>
        );
    }

    const blog = response.results;

    console.log("🚀 ~ BlogPage ~ blog:", blog)

    return (
        <div className="w-full flex flex-col gap-8">
            <BlogHeader blog={blog} />
            <Divider />
            <BlogContent blog={blog} />
            <Divider />
            <BlogFooter blog={blog} />
        </div>
    );
}
