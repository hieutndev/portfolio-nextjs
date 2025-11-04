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
