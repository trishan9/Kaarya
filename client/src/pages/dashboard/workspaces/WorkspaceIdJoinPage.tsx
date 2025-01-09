import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { useGetWorkspaceInfo } from "@/hooks/useWorkspaces"; 
import { JoinWorkspaceForm } from "@/pages/dashboard/workspaces/_components/JoinWorkspaceForm";
import { useInviteCode } from "@/hooks/userInviteCode"; 
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

// type Member = {
//     id: string;
//     role : string;
//     userId : string;
//     workspaceId : string
// }

export const WorkspaceIdJoinPage = () => {
    // const currUser = useAuthStore((state) => state.user);
    const workspaceId = useWorkspaceId();
    const inviteCode = useInviteCode();

    const { data, isLoading } = useGetWorkspaceInfo({
        workspaceId,
    });
    const workspace=data?.data.workspace;
    
    if (isLoading) return <PageLoader />;

    if (!workspace) return <PageError message="Workspace not found" />;

    if (workspace.inviteCode != inviteCode) return <PageError message="The invitation link is invalid or expired" />;

    return (
        <div className="w-full lg:max-w-xl">
            <JoinWorkspaceForm
                initialValues={workspace}
                workspaceId={workspaceId}
                code={inviteCode}
            />
        </div>
    );
};