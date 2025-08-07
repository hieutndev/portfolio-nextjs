import ProjectFormComponent from "@/components/pages/projects/project-form";
import AdminHeader from "@/components/shared/partials/admin-header";
import ICON_CONFIG from "@/configs/icons";
import ROUTE_PATH from "@/configs/route-path";
import Container from "@/components/shared/container/container";

interface NewProjectPageProps {
	mode: "create" | "edit";
}

export default function NewProjectPage({ mode }: NewProjectPageProps) {
	return (
		<Container
			orientation={"vertical"}
			className={"gap-4"}
		>
			<AdminHeader
				title={"Create New Project"}
				backButton={{
					color: "default",
					size: "lg",
					variant: "solid",
					startContent: ICON_CONFIG.BACK,
					text: "Back",
					href: ROUTE_PATH.ADMIN.PROJECT.INDEX,
				}}
				breadcrumbs={["Projects", "Create new Project"]}
			/>
			<ProjectFormComponent mode="create" />
		</Container>
	);
}
