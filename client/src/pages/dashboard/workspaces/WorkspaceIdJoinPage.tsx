import { PageError } from "@/components/PageError";
// import { PageLoader } from "@/components/PageLoader";
// import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { JoinWorkspaceForm } from "@/pages/dashboard/workspaces/_components/JoinWorkspaceForm";
// import { useInviteCode } from "@/";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export const WorkspaceIdJoinPage = () => {
    const workspaceId = useWorkspaceId();
    const inviteCode = "I-1000"
    // const { data: initialValues, isLoading } = useGetWorkspaceInfo({
    //     workspaceId,
    // });

    // if (isLoading) return <PageLoader />;
    const initialValues={
        id : "1",        
        name : "Trishan Wagle Workspace",
        imageUrl : ""
    }
    if (!initialValues) return <PageError message="Workspace not found" />;

    return (
        <div className="w-full lg:max-w-xl">
            <JoinWorkspaceForm
                initialValues={initialValues}
                workspaceId={workspaceId}
                code={inviteCode}
            />
        </div>
    );
};