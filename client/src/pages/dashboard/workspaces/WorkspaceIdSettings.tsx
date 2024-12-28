// import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { EditWorkspaceForm } from "@/pages/dashboard/workspaces/_components/EditWorkspaceForm";
// import { useWorkspaceId } from "@/hooks/userWorkspaceId";

import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";

export const WorkspaceIdSettings = () => {
    // const workspaceId = useWorkspaceId();
    // const { data: initialValues, isLoading } = useGetWorkspace({ workspaceId });
    const isLoading=false
    
        const initialValues = {
            id: "W-1244",
            name: "Nischay's Workspace",
            imageUrl: "https://cdn.worldvectorlogo.com/logos/react-1.svg",
            inviteCode : "I-1234",
            userId: "U-123"
        }

    if (isLoading) return <PageLoader />;
    if (!initialValues) return <PageError message="Workspace not found" />;

    return (
        <div className="w-full lg:max-w-xl">
            <EditWorkspaceForm initialValues={initialValues} />
        </div>
    );
};