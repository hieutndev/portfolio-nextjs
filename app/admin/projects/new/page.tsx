
import AdminHeader from "@/components/shared/partials/admin-header";
import ICON_CONFIG from "@/configs/icons";
import ROUTE_PATH from "@/configs/route-path";
import Container from "@/components/shared/container/container";
import ProjectFormMarkDownComponent from "@/components/pages/projects/project-form-markdown";

export default function NewProjectPage() {
	return (
		<Container
			className={"gap-4 h-max"}
			orientation={"vertical"}
		>
			<AdminHeader
				backButton={{
					color: "default",
					size: "lg",
					variant: "solid",
					startContent: ICON_CONFIG.BACK,
					text: "Back",
					href: ROUTE_PATH.ADMIN.PROJECT.INDEX,
				}}
				breadcrumbs={["Projects", "Create new Project"]}
				title={"Create New Project"}
			/>
			<ProjectFormMarkDownComponent mode="create" />
		</Container>
	);
}
