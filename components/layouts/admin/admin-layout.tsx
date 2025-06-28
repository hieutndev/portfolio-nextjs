import AdminSidebar from "@/components/shared/partials/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={"w-full h-full flex justify-start items-start"}>
			<div className={"w-max h-screen"}>
				<AdminSidebar />
			</div>
			<div className={"w-full h-full overflow-auto"}>{children}</div>
		</div>
	);
}
