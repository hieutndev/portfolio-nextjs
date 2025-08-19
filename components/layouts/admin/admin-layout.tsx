"use client";
import { useReactiveCookiesNext } from "cookies-next";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import AdminSidebar from "@/components/shared/partials/admin-sidebar";
import API_ROUTE from "@/configs/api";
import { useFetch } from "@/hooks/useFetch";


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

    return (
        <div className={"w-screen h-screen flex justify-start items-start"}>
            <div className={"w-1/6 h-screen"}>
                <AdminSidebar />
            </div>
            <div className={"w-5/6 h-full overflow-auto p-4"}>{children}</div>
        </div>
    );
}
