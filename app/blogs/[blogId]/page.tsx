import { Metadata } from "next";
import { serverFetch } from "hieutndev-toolkit";
import { Divider } from "@heroui/react";
import { redirect, RedirectType } from "next/navigation";
import { cookies } from "next/headers";

import { TBlogResponse } from "@/types/blog";
import API_ROUTE from "@/configs/api";
import { IAPIResponse } from "@/types/global";
import BlogContent from "@/components/pages/blogs/blog-content";
import BlogFooter from "@/components/pages/blogs/blog-footer";
import BlogHeader from "@/components/pages/blogs/blog-header";

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
        title: `${blog.title} | hieutndev's`,
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

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value || null;

    // Fetch blog data on the server (handles both ID and slug)
    const response = await serverFetch<IAPIResponse<TBlogResponse>>(
        API_ROUTE.BLOG.GET_ONE(blogId),
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-cache",
        }
    );

    if (response.status !== "success" || !response.results) {
        if (response.message === "EXPIRED_REFRESH_TOKEN" && accessToken) {
            redirect('/sign-in', RedirectType.replace)
        } else {
            redirect('/not-found', RedirectType.replace)
        }
    }

    const blog = response.results;

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
