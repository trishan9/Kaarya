import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { useGetTask } from "@/hooks/useTasks";
import { useGetMembers } from "@/hooks/useMembers";
import { useGetProjects } from "@/hooks/useProjects";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

import { EditTaskForm } from "./EditTaskForm";
import { Project } from "../../projects/_schemas";
import { Member } from "../../workspaces/_schemas";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  id: string;
}

export const EditTaskFormWrapper = ({
  onCancel,
  id,
}: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: initialValues, isLoading: taskLoading } = useGetTask({
    taskId: id,
  });

  const { data: projectsData, isLoading: loadingProjects } = useGetProjects({
    workspaceId: workspaceId,
  });

  const { data, isLoading: loadingMembers } = useGetMembers({
    workspaceId,
  });

  const members = data?.data?.workspace.members as Member[];

  const projects = projectsData?.data.projects;

  const projectOptions = projects?.map((project: Project) => ({
    id: project.id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));
  const memberOptions = members?.map((member) => ({
    id: member.id,
    name: member.name,
  }));

  const isLoading = loadingProjects || loadingMembers || taskLoading;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  if (!initialValues) return null;
  return (
    <EditTaskForm
      initialValues={initialValues?.data?.task}
      onCancel={onCancel}
      memberOptions={memberOptions ?? []}
      projectOptions={projectOptions ?? []}
    />
  );
};

