import React from "react";
import { useNavigate } from "react-router"; 

import { Member } from "../../workspaces/_schemas";
import { Project } from "../../projects/_schemas"; 
import { MemberAvatar } from "../../workspaces/_components/MemberAvatar"; 
import { ProjectAvatar } from "../../projects/_components/ProjectAvatar"; 
import { useWorkspaceId } from "@/hooks/useWorkspaceId"; 

import { cn } from "@/lib/utils";

import { TaskStatus } from "../_schemas"; 
interface EventCardProps {
    id: string;
    title: string;
    project: Project;
    status: TaskStatus;
    assignee: Member;
}
const statusColorMap: Record<TaskStatus, string> = {
    [TaskStatus.BACKLOG]: "border-l-pink-500",
    [TaskStatus.TODO]: "border-l-red-500",
    [TaskStatus.COMPLETED]: "border-l-emerald-500",
    [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
    [TaskStatus.IN_REVIEW]: "border-l-blue-500",
};

export const EventCard = ({
    assignee,
    id,
    project,
    status,
    title,
}: EventCardProps) => {
    const workspaceId = useWorkspaceId();
    const navigate = useNavigate();

    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        navigate(`/workspaces/${workspaceId}/tasks/${id}`);
    };

    return (
        <div className="px-2">
            <div
                onClick={onClick}
                className={cn(
                    "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition ",
                    statusColorMap[status]
                )}
            >
                <p>{title}</p>
                <div className="flex items-center gap-x-1">
                    <MemberAvatar name={assignee?.name} />
                    <div className="dot" />
                    <ProjectAvatar name={project?.name} image={project?.imageUrl} />
                </div>
            </div>
        </div>
    );
};