"use client"
import AdminSidebar from "@/components/shared/partials/admin-sidebar";


export default function AdminLayout({children}: { children: React.ReactNode }) {

    // const {getCookie, hasCookie} = useReactiveCookiesNext();

    // const router = useRouter();

    // useEffect(() => {
    //     if (!getCookie('refresh_token')) {
    //         router.push("/sign-in");
    //     }
    // }, [getCookie])

    return (
        <div className={"w-full h-full flex justify-start items-start"}>
            <div className={"w-max h-screen"}>
                <AdminSidebar/>
            </div>
            <div className={"w-full h-full overflow-auto p-4"}>{children}</div>
        </div>
    );
}
