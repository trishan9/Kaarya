import { EditWorkspaceForm } from "@/pages/dashboard/workspaces/_components/EditWorkspaceForm";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetWorkspace } from "@/hooks/useWorkspaces";

const WorkspaceIdSettings = () => {
  const workspaceId: string = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace({ workspaceId });
  const workspace = data?.data?.workspace;

  if (isLoading) return <PageLoader />;

  if (!data?.data?.workspace)
    return <PageError message="Workspace not found" />;

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default WorkspaceIdSettings;

