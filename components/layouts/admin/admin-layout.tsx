"use client";
import AdminSidebar from "@/components/shared/partials/admin-sidebar";
import API_ROUTE from "@/configs/api";
import { useFetch } from "@/hooks/useFetch";
import { useReactiveCookiesNext } from "cookies-next";
import { usePathname } from "next/navigation";
import { skip } from "node:test";
import { useEffect } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const { getCookie } = useReactiveCookiesNext();

    const { data, fetch } = useFetch(
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
        <div className={"w-full h-full flex justify-start items-start"}>
            <div className={"w-max h-screen"}>
                <AdminSidebar />
            </div>
            <div className={"w-full h-full overflow-auto p-4"}>{children}</div>
        </div>
    );
}
