// app/products/sitemap.ts
import type { MetadataRoute } from 'next'

import { serverFetch } from 'nextage-toolkit';

import API_ROUTE from '@/configs/api';
import { TProjectResponse } from '@/types/project';
import { IAPIResponse } from '@/types/global';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// Step 1: Tell Next.js how many sitemaps to generate
export async function generateSitemaps() {

    const response = await serverFetch<IAPIResponse<TProjectResponse[]>>(API_ROUTE.PROJECT.GET_ALL);

    const listProjects = response.results || [];

    const sitemapsNeeded = Math.ceil(listProjects.length / 50000)

    return Array.from({ length: sitemapsNeeded }, (_, i) => ({ id: i }))
}

// Step 2: Generate each sitemap based on the id
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const start = id * 50000
    const end = start + 50000
    const response = await serverFetch<IAPIResponse<TProjectResponse[]>>(API_ROUTE.PROJECT.GET_ALL);


    const listProjects = response.results?.slice(start, end) || [];

    return listProjects.map((project) => ({
        url: `${siteUrl}/projects/${project.slug}`,
        lastModified: project.updated_at ? new Date(project.updated_at) : new Date(),
    }))
}
