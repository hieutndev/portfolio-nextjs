// import SYS_ICONS from "@/configs/icons";

import ICON_CONFIG from "./icons";

export const SITE_CONFIG = {
    NAME: "Tran Ngoc Hieu | hieutndev's",
    DESCRIPTION: "Explore Tran Ngoc Hieu's professional portfolio. View detailed completed projects, work experience, and a modern web development skill set.",
    LOGO: {
        ONLY_ICON_WHITE: "/1x1w.png",
        ONLY_ICON_BLACK: "/1x1b.png",
        FULL_WHITE: "/logow_w.png",
        FULL_BLACK: "/black_full_board.png",
        // FULL_BLACK: "/hdev.png",
    },
    FAVICON: "/favicon.ico",
    ADMIN_SIDEBAR_ITEMS: [
        {
            label: "Dashboard",
            href: "/admin/dashboard",
            icon: ICON_CONFIG.DASHBOARD
        },
        {
            label: "Accounts",
            href: "/admin/accounts",
            icon: ICON_CONFIG.ACCOUNT
        },
        {
            label: "Education",
            href: "/admin/educations",
            icon: ICON_CONFIG.EDUCATION
        },
        {
            label: "Certification",
            href: "/admin/certifications",
            icon: ICON_CONFIG.CERTIFICATION
        },
        {
            label: "Employment",
            href: "/admin/employments",
            icon: ICON_CONFIG.EMPLOYMENT
        },
        {
            label: "Projects",
            href: "/admin/projects",
            icon: ICON_CONFIG.PROJECT
        },
        {
            label: "Blogs",
            href: "/admin/blogs",
            icon: ICON_CONFIG.BLOG
        },
        {
            label: "Applications",
            href: "/admin/applications",
            icon: ICON_CONFIG.APP
        },
        {
            label: "Settings",
            href: "/admin/settings",
            icon: ICON_CONFIG.SETTING
        }
    ],
    nonAuthUrls: ["/sign-in", "/sign-up", "/forgot-password"],
};

export type TSiteConfig = typeof SITE_CONFIG;
