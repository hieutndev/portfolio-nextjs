"use client";
import { useReactiveCookiesNext } from "cookies-next";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useFetch, useWindowSize } from "hieutndev-toolkit";
import { Spinner } from "@heroui/react";
import clsx from "clsx";

import AdminSidebar from "@/components/shared/partials/admin-sidebar";
import API_ROUTE from "@/configs/api";
import { BREAK_POINT } from "@/configs/break-point";
import AdminHorizontalNav from "@/components/shared/partials/admin-horizontal-nav";



export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const { getCookie } = useReactiveCookiesNext();

    const { fetch } = useFetch(
        API_ROUTE.ACCOUNT.CHECK_SESSION,
        {
            token: getCookie("refresh_token"),
        },
        {
            skip: true,
        }
    );

    useEffect(() => {
        console.log("test", getCookie("refresh_token"));

        if (getCookie("refresh_token")) {
            fetch();
        }
    }, [pathname, getCookie("refresh_token")]);

    const { width } = useWindowSize();


    return (
        <div className={"w-screen h-screen flex flex-col"}>
            <div
                className={clsx("w-screen h-full", {
                    "grid grid-cols-12": width > BREAK_POINT.XL,
                    flex: width <= BREAK_POINT.XL,
                })}
            >
                <div
                    className={clsx("relative h-100", {
                        "col-span-2": width > BREAK_POINT.XL,
                        "w-max": width <= BREAK_POINT.XL,
                        hidden: width <= BREAK_POINT.LG,
                    })}
                >
                    <AdminSidebar />
                </div>
                <div
                    className={clsx("flex flex-col gap-4 max-h-screen overflow-auto", {
                        "col-span-10": width > BREAK_POINT.XL,
                        "w-full": width <= BREAK_POINT.XL,
                    })}
                >
                    {width < BREAK_POINT.LG && <AdminHorizontalNav />}
                    <div
                        className={clsx({
                            "p-8": width >= BREAK_POINT.XL,
                            "p-4": width < BREAK_POINT.XL && width >= BREAK_POINT.MD,
                            "p-2": width < BREAK_POINT.MD,
                        })}
                    >
                        {
                            children
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
