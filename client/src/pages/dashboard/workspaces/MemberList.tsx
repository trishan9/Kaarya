import { Link } from "react-router";
import { Fragment } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/ui/dotted-separator"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { useGetMembers } from "@/features/members/api/use-get-members";
// import { useDeleteMember } from "@/features/members/api/use-delete-member";
// import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { MemberAvatar } from "./_components/MemberAvatar"; 
import { useConfirm } from "@/hooks/useConfirm";
import { useGetWorkspace } from "@/hooks/useWorkspaces";

export enum MemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
}

type Member = {
    id: string;
    role: MemberRole;
    userId: string;
    workspaceId: string;
    name?: string;  
    email?: string;   
}

export const MembersList = () => {
	const workspaceId = useWorkspaceId();
	const [ConfirmDialog, confirm] = useConfirm(
		"Remove Member",
		"This member will be removed from the workspace",
		"destructive"
	);

	const memberData = useGetWorkspace({ workspaceId });
    const data = memberData.data?.data.workspace.members as Member[]

	// const { mutate: deleteMember, isPending: deletingMember } = useDeleteMember();
	// const { mutate: updateMember, isPending: updatingMember } = useUpdateMember();

	const handleUpdateMember = (memberId: string, role: MemberRole) => {
        console.log(memberId,role)
		// updateMember({ param: { memberId }, json: { role } });
	};

	const handleDeleteMember = async (memberId: string) => {
		const ok = await confirm();
		if (!ok) return;
        console.log(memberId)
		// deleteMember(
		// 	{ param: { memberId } },
		// 	{
		// 		onSuccess: () => {
		// 			window.location.reload();
		// 		},
		// 	}
		// );
	};

	return (
        <div className="w-full lg:max-w-xl"> 
            <Card className="size-full border-none shadow-none">
                <ConfirmDialog />

                <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                    <Button asChild variant="outline" size="sm">
                        <Link to={`/workspaces/${workspaceId}`}>
                            <ArrowLeft className="size-4 mr-2" />
                            Back
                        </Link>
                    </Button>

                    <CardTitle className="text-xl font-bold">Members List</CardTitle>
                </CardHeader>

                <div className="px-7">
                    <DottedSeparator />
                </div>

                <CardContent className="p-7">
                    {data?.map((member, idx) => (
                        <Fragment key={member.id}>
                            <div className="flex items-center gap-2">
                                <MemberAvatar
                                    className="size-10"
                                    fallbackClassName="text-lg"
                                    name="test"
                                />

                                <div className="flex flex-col">
                                    <p className="text-sm font-medium">Test</p>

                                    <p className="text-xs font-medium">test@gmail.com</p>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="ml-auto" variant="secondary" size="icon">
                                            <MoreVertical className="size-4 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent side="bottom" align="end">
                                        <DropdownMenuItem
                                            className="font-medium"
                                            onClick={() =>
                                                handleUpdateMember(member.id, MemberRole.ADMIN)
                                            }
                                            // disabled={updatingMember}
                                        >
                                            Set as Administrator
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className="font-medium"
                                            onClick={() =>
                                                handleUpdateMember(member.id, MemberRole.MEMBER)
                                            }
                                            // disabled={updatingMember}
                                        >
                                            Set as Member
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuItem
                                            className="font-medium text-amber-700"
                                            onClick={() => handleDeleteMember(member.id)}
                                            // disabled={deletingMember}
                                        >
                                            Remove {member.name}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            
                            {idx < data.length - 1 && (
                                <Separator className="my-2.5 bg-neutral-400/40" />
                            )}
                        </Fragment>
                    ))}
                </CardContent>
            </Card>
        </div>
	);
};