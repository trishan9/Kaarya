"use client";
import { useQueryState } from "nuqs";
import { Loader, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/ui/dotted-separator"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useWorkspaceId } from "@/hooks/useWorkspaceId"; 

import { useProjectId } from "@/hooks/userProjectId"; 
import { useCreateTaskModal } from "@/hooks/useCreateTaskModal"; 
import { useTaskFilter } from "./useTaskFilter";
import { useGetTasks } from "@/hooks/useTasks"; 
import { DataFilters } from "./DataFilters"; 
// import { DataKanban } from "./data-kanban";
// import { DataTable } from "./data-table";
import { columns } from "./columns";
import { DataTable } from "./DataTable";

// import { TaskStatus } from "../_schemas"; 
// import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
// import { DataCalander } from "./data-calander";

interface TaskViewSwitcherProps {
	hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({
	hideProjectFilter,
}: TaskViewSwitcherProps) => {
	const [{ status, dueDate, assigneeId, projectId }] = useTaskFilter();

	const [view, setView] = useQueryState("task-view", {
		defaultValue: "table",
	});
	const { open } = useCreateTaskModal();
	const workspaceId = useWorkspaceId();
	const paramProjectId = useProjectId();
	// const { mutate: bulkUpdate } = useBulkUpdateTasks();
	const { data: tasks, isLoading: tasksLoading } = useGetTasks({
		workspaceId,
		assigneeId,
		projectId: paramProjectId || projectId,
		dueDate,
		status,
	});

	// const onKanbanChange = useCallback(
	// 	(
	// 		tasks: {
	// 			$id: string;
	// 			status: TaskStatus;
	// 			position: number;
	// 		}[]
	// 	) => {
	// 		bulkUpdate({
	// 			json: { tasks },
	// 		});
	// 	},
	// 	[]
	// );
	return (
		<Tabs
			defaultValue={view}
			onValueChange={setView}
			className="flex-1 w-full border rounded-lg"
		>
			<div className="h-full flex flex-col overflow-auto p-4">
				<div className="flex  lg:flex-row gap-y-2 items-center justify-start w-full">
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
					<Button onClick={open} size="sm" className="w-full lg:w-auto">
						<Plus className="size-4 mr-2" />
						New
					</Button>
				</div>
				<DottedSeparator className="my-4" />
				<DataFilters hideProjectFilter={hideProjectFilter} />
				<DottedSeparator className="my-4" />
				{tasksLoading ? (
					<div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
						<Loader className="size-5 animate-spin text-muted-foreground" />
					</div>
				) : (
					<>
						<TabsContent value="table" className="mt-0">
							<DataTable columns={columns} data={tasks?.documents ?? []} />
						</TabsContent>
						<TabsContent value="kanban" className="mt-0">
							{/* <DataKanban
								onChange={onKanbanChange}
								data={tasks?.documents ?? []}
							/> */}
              <p>data kanban</p>
						</TabsContent>
						<TabsContent value="calendar" className="mt-0 h-full pb-4">
							{/* <DataCalander data={tasks?.documents ?? []} /> */}
              <p>data calender</p>
						</TabsContent>
					</>
				)}
			</div>
		</Tabs>
	);
};