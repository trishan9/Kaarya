"use client";
// import { useCallback } from "react";
import { useQueryState } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

// import { useWorkspaceId } from "@/hooks/useWorkspaceId";

// import { useProjectId } from "@/hooks/userProjectId";
// import { useCreateTaskModal } from "../hooks/use-create-task-modal";
// import { useTaskFilter } from "../hooks/use-task-filter";
// import { useGetTasks } from "../api/use-get-tasks";
// import { DataFilters } from "./data-filters";
// import { DataKanban } from "./data-kanban";
// import { DataTable } from "./data-table";
// import { columns } from "./columns";

// import { TaskStatus } from "../types";
// import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
// import { DataCalander } from "./data-calander";

interface TaskViewSwitcherProps {
	hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({
	// hideProjectFilter,
}: TaskViewSwitcherProps) => {
	// const [{ status, dueDate, assigneeId, projectId }] = useTaskFilter();

	const [view, setView] = useQueryState("task-view", {
		defaultValue: "table",
	});
	// const { open } = useCreateTaskModal();
	// const workspaceId = useWorkspaceId();
	// const paramProjectId = useProjectId();
	// const { mutate: bulkUpdate } = useBulkUpdateTasks();
	// const { data: tasks, isLoading: tasksLoading } = useGetTasks({
	// 	workspaceId,
	// 	assigneeId,
	// 	projectId: paramProjectId || projectId,
	// 	dueDate,
	// 	status,
	// });

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
					{/* <Button 
                    // onClick={open} 
                    size="sm" 
                    className="w-full lg:w-auto">
						<Plus className="size-4 mr-2" />
						New
					</Button> */}
				</div>
				<>
				<TabsContent value="table" className="mt-2">
							<h1>I am table</h1>
				</TabsContent>

				<TabsContent value="kanban" className="mt-2">
							<h1>I am kanban</h1>
				</TabsContent>

				<TabsContent value="calendar" className="mt-2">
							<h1>I am calendar</h1>
				</TabsContent>
				</>
				 
			</div>
		</Tabs>
	);
};