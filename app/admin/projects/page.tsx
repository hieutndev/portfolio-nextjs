import Container from "@/components/shared/container/container";
import AdminHeader from "@/components/shared/partials/admin-header";
import ProjectGroupsManagement from "@/components/pages/projects/project-groups-management";
import ProjectManagement from "@/components/pages/projects/project-management";

export default function ProjectManagementPage() {
	return (
		<Container
			shadow
			className={"border border-default-200 rounded-2xl"}
			orientation={"vertical"}
		>
			<AdminHeader
				breadcrumbs={["Admin", "Projects Management"]}
				title={"Projects Management"}
			/>
			<div className={"grid grid-cols-4 gap-4"}>
				<div className={"col-span-1"}>
					<ProjectGroupsManagement />
				</div>
				<div className={"col-span-3"}>
					<ProjectManagement />
				</div>
			</div>
		</Container>
	);
}
