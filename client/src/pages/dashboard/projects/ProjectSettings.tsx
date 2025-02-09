import { useProjectId } from "@/hooks/useProjectId";
import { EditProjectForm } from "./_components/EditProjectForm";
import { useGetProject } from "@/hooks/useProjects";
import { PageLoader } from "@/components/PageLoader";
import { PageError } from "@/components/PageError";

export const ProjectSettingsPage = () => {
  const projectId = useProjectId();
  const { data, isLoading } = useGetProject({ projectId });
  const initialValues = data?.data.project;

  if (isLoading) return <PageLoader />;
  if (!initialValues) return <PageError message="Project not found" />;

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};
