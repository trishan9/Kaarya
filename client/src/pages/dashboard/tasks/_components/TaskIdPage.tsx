import { PageLoader } from "@/components/PageLoader"; 
import { PageError } from "@/components/PageError"; 
import { useGetTask } from "@/hooks/useTasks"; 
import { useTaskId } from "@/hooks/useTaskid"; 
import { DottedSeparator } from "@/components/ui/dotted-separator"; 
import { TaskOverview } from "./TaskOverview";
import { TaskDescription } from "./TaskDescription";
import { TaskBreadcrumbs } from "./TaskBreadcrumbs";

export const TaskIdPage = () => {
    const taskId = useTaskId();
    const { data, isLoading } = useGetTask({ taskId });

    if (isLoading) return <PageLoader />;

    if (!data) return <PageError message="Task not found" />;

    return (
        <div className="flex flex-col">
            <TaskBreadcrumbs task={data.data.task} project={data?.data?.task.project} />
            <DottedSeparator className="my-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TaskOverview task={data.data.task} />
                <TaskDescription task={data.data.task} />
            </div>
        </div>
    );
};