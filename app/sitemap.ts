import { MetadataRoute } from "next";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;


export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${siteUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        // {
        //     url: `${siteUrl}/sign-up`,
        //     lastModified: new Date(),
        //     changeFrequency: 'monthly',
        //     priority: 0.8,
        // },
        // {
        //     url: `${siteUrl}/sign-in`,
        //     lastModified: new Date(),
        //     changeFrequency: 'monthly',
        //     priority: 0.8,
        // },
        {
            url: `${siteUrl}/my-apps`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${siteUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
    ]
}

