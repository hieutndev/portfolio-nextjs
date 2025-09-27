"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";

import ClientLayout from "./client/client-layout";
import NonAuthLayout from "./non-auth/non-auth-layout";
import AdminLayout from "./admin/admin-layout";

import { SITE_CONFIG } from "@/configs/site-config";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const [isDocumentReady, setIsDocumentReady] = useState(false);

	useEffect(() => {
		if (document.readyState === "complete") {
			setIsDocumentReady(true);
		} else {
			const handleReadyStateChange = () => {
				if (document.readyState === "complete") {
					setIsDocumentReady(true);
				}
			};

			document.addEventListener("readystatechange", handleReadyStateChange);

			return () => document.removeEventListener("readystatechange", handleReadyStateChange);
		}
	}, []);

	if (!isDocumentReady) {
		return (
			<div className={"h-screen w-screen flex items-center justify-center"}>
				<Spinner size={"lg"} />
			</div>
		);
	}

	if (SITE_CONFIG.nonAuthUrls.includes(pathname)) {
		return <NonAuthLayout>{children}</NonAuthLayout>;
	} else if (pathname.startsWith("/admin")) {
		return <AdminLayout>{children}</AdminLayout>;
	} else {
		return <ClientLayout>{children}</ClientLayout>;
	}
}
