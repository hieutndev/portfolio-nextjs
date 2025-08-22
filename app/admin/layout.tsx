import { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		template: "%s | hieutndev's Portfolio",
		default: "Admin",
	}
}

export default function AdminSideLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
