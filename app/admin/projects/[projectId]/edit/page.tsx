import ProjectFormComponent from "@/components/pages/projects/project-form";


interface EditProjectPageProps {
	params: Promise<{ projectId: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
	const { projectId } = await params;

	return <ProjectFormComponent mode="edit" projectId={projectId} />;
}
