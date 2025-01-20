import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { useGetProjects } from "@/hooks/useProjects";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();

  console.log(workspaceId);
  const { data: projects, isLoading: projectsLoading } = useGetProjects({
    workspaceId,
  });

  console.log(projectsLoading);
  console.log(projects);

  const isLoading = projectsLoading;

  if (isLoading) return <PageLoader />;

  if (!projects) {
    return <PageError message="Failed to load workspace data" />;
  }

  return <div>This is New Workspace Page</div>;
};
