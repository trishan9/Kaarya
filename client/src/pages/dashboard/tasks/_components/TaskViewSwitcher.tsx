import { useCallback } from "react";
import { useQueryState } from "nuqs";
import { Loader2, Plus, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useProjectId } from "@/hooks/useProjectId";
import { useCreateTaskModal } from "@/hooks/useCreateTaskModal";
import { useTaskFilter } from "./useTaskFilter";
import { useGetTasks } from "@/hooks/useTasks";
import { DataFilters } from "./DataFilters";
import { DataKanban } from "./DataKanban";
import { columns } from "./columns";
import { DataTable } from "./DataTable";

import { useBulkUpdateTasks } from "@/hooks/useTasks";
import { TaskStatus } from "../_schemas";
import { DataCalendar } from "./DataCalendar";
import { Link, useLocation } from "react-router";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export interface BulkUpdateParams {
  id: string;
  status: TaskStatus;
  position: number;
}

export const TaskViewSwitcher = ({
  hideProjectFilter,
}: TaskViewSwitcherProps) => {
  const [{ status, dueDate, assigneeId, projectId, priority }] =
    useTaskFilter();

  const location = useLocation();
  const pathname = location.pathname;

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const { open } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();
  const { mutate: bulkUpdate } = useBulkUpdateTasks();
  const { data: tasks, isLoading: tasksLoading } = useGetTasks({
    workspaceId,
    assigneeId,
    projectId: paramProjectId || projectId,
    priority: priority,
    dueDate,
    status,
  });

  const onKanbanChange = useCallback((tasks: BulkUpdateParams[]) => {
    bulkUpdate({ data: tasks });
  }, []);
  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col lg:flex-row gap-y-2 items-center justify-between">
          <div className="w-full">
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
                Table
              </TabsTrigger>
            </TabsList>

            <TabsList className="w-full lg:w-auto">
              <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
                Kanban
              </TabsTrigger>
            </TabsList>

            <TabsList className="w-full lg:w-auto">
              <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
                Calendar
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Button onClick={open} size="sm" className="w-full lg:w-auto ">
              <Plus className="size-4" />
              Add New Task
            </Button>

            <Button variant="outline" size="default" asChild>
              <Link to={`${pathname}/logs`}>
                <SquarePen className="size-4 mr-2" />
                Logs
              </Link>
            </Button>
          </div>
        </div>

        <DottedSeparator className="my-4" />

        <DataFilters hideProjectFilter={hideProjectFilter} />

        <DottedSeparator className="my-4" />

        {tasksLoading ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.tasks?.tasks ?? []} />
            </TabsContent>

            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                onChange={onKanbanChange}
                data={tasks?.tasks?.tasks ?? []}
              />
            </TabsContent>

            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.tasks?.tasks ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
