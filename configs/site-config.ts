// import SYS_ICONS from "@/configs/icons";

export const SITE_CONFIG = {
    NAME: "hieutndev's",
    DESCRIPTION: "Tran Ngoc Hieu's Portfolio",
    LOGO: {
        ONLY_ICON_WHITE: "/1x1w.png",
        ONLY_ICON_BLACK: "/1x1b.png",
        FULL_WHITE: "logow_w.png",
        FULL_BLACK: "logow_b.png",
    },
    FAVICON: "/portfolio_fav.ico",
    // SIDEBAR_ITEMS: [
    //     {
    //         label: "Overview",
    //         href: "/overview",
    //         icon: SYS_ICONS.OVERVIEW.LG
    //     },
    //     {
    //         label: "Transactions",
    //         href: "/transactions",
    //         icon: SYS_ICONS.TRANSACTIONS.LG
    //     },
    //     {
    //         label: "Forecasts",
    //         href: "/forecasts",
    //         icon: SYS_ICONS.FORECAST.XL
    //     },
    //     {
    //         label: "Settings",
    //         href: "/settings",
    //         icon: SYS_ICONS.SETTING.LG
    //     }
    // ],
    nonAuthUrls: ["/sign-in", "/sign-up", "/forgot-password"],
};

export type TSiteConfig = typeof SITE_CONFIG;

export type TSettingMenu = {
    label: string[];
    key: string;
    urls: string[];
    icon: React.ReactNode;
};