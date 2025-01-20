import { Project } from "../../projects/_schemas"; 
import { Task } from "../_schemas"; 
import { ProjectAvatar } from "../../projects/_components/ProjectAvatar";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { Link } from "react-router";
import { ChevronRight, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "@/hooks/useTasks";
import { useConfirm } from "@/hooks/useConfirm"; 
import { useNavigate } from "react-router";

interface TaskBreadcrumbsProps {
    project: Project;
    task: Task;
}

export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
    const workspaceId = useWorkspaceId();
    const navigate = useNavigate();
    const { mutate, isPending } = useDeleteTask();
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Task",
        "Are you sure you want to delete this task?",
        "destructive"
    );

    const handleDeleteTask = async () => {
        const ok = await confirm();
        if (!ok) return;
        mutate(
            { taskId: task.id } ,
            {
                onSuccess: () => {
                    navigate(-1);
                },
            }
        );
    };
    return (
        <div className="flex items-center gap-x-2">
            <ConfirmDialog />
            <ProjectAvatar
                name={project.name}
                image={project.imageUrl}
                className="size-6 lg:size-8"
            />

            <Link to={`/workspaces/${workspaceId}/projects/${project.id}`}>
                <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
                    {project.name}
                </p>
            </Link>
            <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />
            <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
            <Button
                onClick={handleDeleteTask}
                variant="destructive"
                disabled={isPending}
                className="ml-auto"
                size="sm"
            >
                <Trash className="size-4 lg:mr-2" />
                <span className="hidden lg:block">Delete Task</span>
            </Button>
        </div>
    );
};