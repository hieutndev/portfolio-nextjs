import { MetadataRoute } from 'next';
import { serverFetch } from "hieutndev-toolkit";

import API_ROUTE from "@/configs/api";
import { IAPIResponse } from "@/types/global";
import { TBlog } from "@/types/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        // Fetch all published blogs
        const response = await serverFetch<IAPIResponse<TBlog[]>>(
            API_ROUTE.BLOG.GET_ALL,
            {
                revalidate: 3600, // Cache for 1 hour
            }
        );

        const blogs = response.status === "success" ? response.results || [] : [];

        // Generate sitemap entries for blogs
        const blogEntries: MetadataRoute.Sitemap = blogs
            .filter(blog => blog.published_status === 'published')
            .map((blog) => ({
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/blogs/${blog.slug}`,
                lastModified: new Date(blog.updated_at),
                changeFrequency: 'monthly' as const,
                priority: 0.8,
            }));

        // Main blog listing page
        const blogListEntry: MetadataRoute.Sitemap[0] = {
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        };

        return [blogListEntry, ...blogEntries];
    } catch (error) {
        console.error('Error generating blog sitemap:', error);
        
        // Return at least the main blog page on error
        return [{
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        }];
    }
}
