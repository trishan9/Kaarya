// import { Card, CardContent } from "@/components/ui/card";
// import { useGetMembers } from "@/features/members/api/use-get-members";
// import { useGetProjects } from "@/features/projects/api/use-get-projects";
// import { useWorkspaceId } from "@/hooks/useWorkspaceId";
// import { Loader } from "lucide-react";
import { useGetWorkspace } from "@/hooks/useWorkspaces";
import { CreateTaskForm } from "./CreateTaskForm";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { MemberRole } from "../../workspaces/MemberList";

type Member = {
    id: string;
    role: MemberRole;
    userId: string;
    workspaceId: string;
    name: string;  
    email: string;   
}

interface CreateTaskFormWrapperProps {
    onCancel: () => void;
}

export const CreateTaskFormWrapper = ({
    onCancel,
}: CreateTaskFormWrapperProps) => {
    const workspaceId = useWorkspaceId()
    const workspaceData = useGetWorkspace({ workspaceId });
    const memberData = workspaceData.data?.data.workspace.members as Member[]

    // const { data: projects, isLoading: loadingProjects } = useGetProjects({
    //     workspaceId: workspaceId,
    // });
    // const { data: members, isLoading: loadingMembers } = useGetMembers({
    //     workspaceId: workspaceId,
    // });
    // const projectOptions = projects?.documents.map((project) => ({
    //     id: project.$id,
    //     name: project.name,
    //     imageUrl: project.imageUrl,
    // }));
    const memberOptions = memberData?.map((member) => ({
        id: member.id,
        name: member.name,
    }));

    // const isLoading = loadingProjects || loadingMembers;
    // if (isLoading) {
    //     return (
    //         <Card className="w-full h-[714px] border-none shadow-none">
    //             <CardContent className="flex items-center justify-center h-full">
    //                 <Loader className="size-5 animate-spin text-muted-foreground" />
    //             </CardContent>
    //         </Card>
    //     );
    // }

    const projectOptions = [
        {
            name: "test1 project",
            imageUrl: "",
            id: "123",
        },
        {
            name: "test2 project",
            imageUrl: "",
            id: "124",
        }
    ]

    return (
        <CreateTaskForm
            onCancel={onCancel}
            memberOptions={memberOptions ?? []}
            projectOptions={projectOptions ?? []}
        />
    );
};