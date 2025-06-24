import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import clsx from "clsx";
import { SITE_CONFIG } from "@/configs/site-config";
import AppLayout from "@/components/layouts/layout";

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
			<body className={clsx("w-screen min-h-screen")}>
				<Providers themeProps={{ defaultTheme: "light" }}>
					<AppLayout>{children}</AppLayout>
				</Providers>
			</body>
		</html>
	);
}
