import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { MemberAvatar } from "../../../../components/MemberAvatar";
import { useEditTaskModal } from "@/hooks/_modals/useEditTaskModal";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskDate } from "./TaskDate";
import { Task } from "../_schemas";
import { useGetWorkspace } from "@/hooks/useWorkspaces";
import { WorkspaceAvatar } from "../../../../components/WorkspaceAvatar";

interface TaskOverviewProps {
  task: Task;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal();
  const workspace = useGetWorkspace({ workspaceId: task.workspaceId });

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-neutral-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>

          <Button onClick={() => open(task.id)} size="sm" variant="outline">
            <Pencil className="size-4 mr-2" />
            Edit
          </Button>
        </div>

        <DottedSeparator className="my-4" />

        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Task Name">
            <p className="text-sm font-medium">{task.name}</p>
          </OverviewProperty>

          <OverviewProperty label="Workspace">
            <WorkspaceAvatar
              name={workspace?.data?.data.workspace.name}
              className="size-6"
            />

            <p className="text-sm font-medium">
              {workspace?.data?.data.workspace.name}
            </p>
          </OverviewProperty>

          <OverviewProperty label="Assignee">
            <MemberAvatar name={task.assignee.name} className="size-6" />

            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>

          <OverviewProperty label="Sprint">
            <p className="text-sm font-medium">{task.sprint}</p>
          </OverviewProperty>

          <OverviewProperty label="Priority">
            <Badge variant={task.priority}>
              {snakeCaseToTitleCase(task.priority)}
            </Badge>
          </OverviewProperty>

          <OverviewProperty label="Story Points">
            <p className="text-sm font-medium">{task.storyPoints}</p>
          </OverviewProperty>

          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>

          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};

interface OverviewPropertiesProps {
  label: string;
  children: React.ReactNode;
}

const OverviewProperty = ({ children, label }: OverviewPropertiesProps) => {
  return (
    <div className="flex items-start gap-x-12">
      <div className="min-w-[100px]">
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>

      <div className="flex items-center gap-x-2">{children}</div>
    </div>
  );
};

