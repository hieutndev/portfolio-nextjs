import ProjectFormComponent from "@/components/pages/projects/project-form";
import AdminHeader from "@/components/shared/partials/admin-header";
import ICON_CONFIG from "@/configs/icons";
import ROUTE_PATH from "@/configs/route-path";
import Container from "@/components/shared/container/container";


interface EditProjectPageProps {
	params: Promise<{ projectId: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
	const { projectId } = await params;

	return (
		<Container
			orientation={"vertical"}
			className={"gap-4"}
		>
			<AdminHeader
				title={"Update Project Details"}
				backButton={{
					color: "default",
					size: "md",
					variant: "solid",
					startContent: ICON_CONFIG.BACK,
					text: "Back",
					href: ROUTE_PATH.ADMIN.PROJECT.INDEX,
				}}
				breadcrumbs={["Projects", "Update Project Details"]}
			/>

			<ProjectFormComponent
				mode="edit"
				projectId={projectId}
			/>
		</Container>
	);
}
