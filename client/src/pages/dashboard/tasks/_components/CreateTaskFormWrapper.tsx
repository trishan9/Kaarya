import { Loader2 } from "lucide-react";
import { useGetWorkspace } from "@/hooks/useWorkspaces";
import { CreateTaskForm } from "./CreateTaskForm";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { MemberRole } from "@/pages/dashboard/workspaces/MemberList";
import { useGetProjects } from "@/hooks/useProjects";
import { Project } from "@/pages/dashboard/projects/_schemas";
import { Card, CardContent } from "@/components/ui/card";

type Member = {
  id: string;
  role: MemberRole;
  userId: string;
  workspaceId: string;
  name: string;
  email: string;
};

interface CreateTaskFormWrapperProps {
  onCancel: () => void;
}

export const CreateTaskFormWrapper = ({
  onCancel,
}: CreateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();
  const { data: workspaceData, isLoading: loadingMembers } = useGetWorkspace({
    workspaceId,
  });
  const memberData = workspaceData?.data.workspace.members as Member[];

  const { data: projectsData, isLoading: loadingProjects } = useGetProjects({
    workspaceId: workspaceId,
  });
  const projects = projectsData?.data.projects;

  const projectOptions = projects?.map((project: Project) => ({
    id: project.id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = memberData?.map((member: Member) => ({
    id: member.id,
    name: member.name,
  }));

  const isLoading = loadingProjects || loadingMembers;
  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      onCancel={onCancel}
      memberOptions={memberOptions ?? []}
      projectOptions={projectOptions ?? []}
    />
  );
};
