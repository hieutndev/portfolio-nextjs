import AdminHeader from "@/components/shared/partials/admin-header";
import ICON_CONFIG from "@/configs/icons";
import ROUTE_PATH from "@/configs/route-path";
import Container from "@/components/shared/container/container";
import ProjectFormMarkDownComponent from "@/components/pages/projects/project-form-markdown";


interface EditProjectPageProps {
	params: Promise<{ projectId: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
	const { projectId } = await params;

	return (
		<ProjectFormMarkDownComponent
			mode="edit"
			projectId={projectId}
		/>
	);
}
