import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Admin - Projects",
};

export default function AdminProjectManagementLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
