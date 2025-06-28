"use client";

import { usePathname, useRouter } from "next/navigation";
import ClientLayout from "./client/client-layout";
import { SITE_CONFIG } from "@/configs/site-config";
import NonAuthLayout from "./non-auth/non-auth-layout";
import AdminLayout from "./admin/admin-layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	if (SITE_CONFIG.nonAuthUrls.includes(pathname)) {
		return <NonAuthLayout>{children}</NonAuthLayout>;
	} else if (pathname.startsWith("/admin")) {
		return <AdminLayout>{children}</AdminLayout>;
	} else {
		return <ClientLayout>{children}</ClientLayout>;
	}
}
