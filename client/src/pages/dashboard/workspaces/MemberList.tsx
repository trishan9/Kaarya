import { Link } from "react-router";
import { Fragment } from "react";
import { ArrowLeft, MoreVertical, Dot } from "lucide-react";
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
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { MemberAvatar } from "./_components/MemberAvatar";
import { useConfirm } from "@/hooks/useConfirm";
import { useGetWorkspace } from "@/hooks/useWorkspaces";
import { useRemoveMember, useUpdateMember } from "@/hooks/useMembers";
import { useGetMe } from "@/hooks/useAuth";
import { Member, MemberRole } from "./_schemas";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove Member",
    "This member will be removed from the workspace",
    "destructive",
  );

  const workspaceData = useGetWorkspace({ workspaceId });
  const superAdminId = workspaceData?.data?.data.workspace.userId;

  const memberdata = workspaceData.data?.data.workspace.members as Member[];

  const currUser = useGetMe();
  const currUserId = currUser?.data?.data.data.id;
  const currMember = memberdata?.find((member) => member.userId == currUserId);

  const isSuperAdmin = currMember?.userId === superAdminId;
  const isAdmin = currMember?.role === "ADMIN";
  const isMember = member?.role === "MEMBER";
  const isMemberNotSuperAdmin =
    member?.userId !== superAdminId && member?.role === "ADMIN";

  const canUpdate =
    (isSuperAdmin && isAdmin && (isMemberNotSuperAdmin || isMember)) ||
    (!isSuperAdmin && isAdmin && isMember);

  const { mutate: deleteMember, isPending: deletingMember } = useRemoveMember();
  const { mutate: updateMember, isPending: updatingMember } = useUpdateMember();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ memberId, role });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;
    deleteMember({ memberId });
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
          {memberdata?.map((member, idx) => (
            <Fragment key={member.id}>
              <div className="flex items-center gap-2">
                <MemberAvatar
                  className="size-10"
                  fallbackClassName="text-lg"
                  name={member.name}
                />

                <div className="flex flex-col">
                  <p className="text-sm font-medium capitalize">
                    {member.name}{" "}
                    {currMember?.id == member.id && (
                      <span className="text-xs font-normal lowercase">
                        (me)
                      </span>
                    )}
                  </p>

                  <div className="flex flex-row items-center text-xs">
                    <p className="font-medium">{member.email} </p>

                    <Dot className="-mx-[5px]" />

                    <p className="capitalize text-green-700">
                      {member.userId == superAdminId
                        ? "super admin"
                        : member.role.toLowerCase()}
                    </p>
                  </div>
                </div>

                {canUpdate && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="ml-auto" variant="outline" size="icon">
                        <MoreVertical className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent side="bottom" align="end">
                      <DropdownMenuItem
                        className="font-medium"
                        onClick={() =>
                          handleUpdateMember(member.id, MemberRole.ADMIN)
                        }
                        disabled={updatingMember}
                      >
                        Set as Administrator
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="font-medium"
                        onClick={() =>
                          handleUpdateMember(member.id, MemberRole.MEMBER)
                        }
                        disabled={updatingMember}
                      >
                        Set as Member
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="font-medium text-amber-700"
                        onClick={() => handleDeleteMember(member.id)}
                        disabled={deletingMember}
                      >
                        Remove {member.name}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {idx < memberdata.length - 1 && (
                <Separator className="my-2.5 bg-neutral-400/40" />
              )}
            </Fragment>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
