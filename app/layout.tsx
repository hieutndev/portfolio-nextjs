import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";
import clsx from "clsx";

import { Providers } from "@/components/providers/providers";
import { SITE_CONFIG } from "@/configs/site-config";
import AppLayout from "@/components/layouts/app-layout";

export const metadata: Metadata = {
	title: SITE_CONFIG.NAME,
	description: SITE_CONFIG.DESCRIPTION,
	icons: {
		icon: SITE_CONFIG.FAVICON,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			suppressHydrationWarning
			lang="en"
		>
			<head>
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-3EM49Q4VD8"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-3EM49Q4VD8');
					`}
				</Script>
			</head>
			<body className={clsx("w-screen min-h-screen")}>
				<Providers themeProps={{ defaultTheme: "light" }}>
					<AppLayout>{children}</AppLayout>
				</Providers>
			</body>
		</html>
	);
}
