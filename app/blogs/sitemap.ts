import { MetadataRoute } from 'next';
import { serverFetch } from "hieutndev-toolkit";

import API_ROUTE from "@/configs/api";
import { IAPIResponse } from "@/types/global";
import { TBlog } from "@/types/blog";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function generateSitemaps() {

    const response = await serverFetch<IAPIResponse<TBlog[]>>(API_ROUTE.BLOG.GET_ALL);

    const listBlogs = response.results || [];

    const sitemapsNeeded = Math.ceil(listBlogs.length / 50000)

    return Array.from({ length: sitemapsNeeded }, (_, i) => ({ id: i }))
}

// Step 2: Generate each sitemap based on the id
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const start = id * 50000
    const end = start + 50000
    const response = await serverFetch<IAPIResponse<TBlog[]>>(API_ROUTE.BLOG.GET_ALL);


    const listBlogs = response.results?.slice(start, end) || [];

    return listBlogs.map((blog) => ({
        url: `${siteUrl}/blogs/${blog.slug}`,
        lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
    }))
}