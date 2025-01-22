import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { useGetProjects } from "@/hooks/useProjects";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: projectsLoading } = useGetProjects({
    workspaceId,
  });

  const isLoading = projectsLoading;

  if (isLoading) return <PageLoader />;

  if (!projects) {
    return <PageError message="Failed to load workspace data" />;
  }

  return <div>This is New Workspace Page</div>;
};
