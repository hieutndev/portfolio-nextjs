"use client";

import { usePathname, useRouter } from "next/navigation";
import ClientLayout from "./client/client-layout";
import { SITE_CONFIG } from "@/configs/site-config";
import NonAuthLayout from "./non-auth/non-auth-layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	if (pathname.startsWith("/admin")) {
		// return <AdminLayout>{children}</AdminLayout>;
	} else if (SITE_CONFIG.nonAuthUrls.includes(pathname)) {
		return <NonAuthLayout>{children}</NonAuthLayout>;
	}

	return <ClientLayout>{children}</ClientLayout>;
}
