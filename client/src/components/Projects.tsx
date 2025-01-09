"use client";
import { Link } from "react-router";
import { useLocation } from "react-router"; 
import { RiAddCircleFill } from "react-icons/ri";

import { cn } from "@/lib/utils";
// import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useCreateProjectModal } from "@/hooks/useCreateProjectModal";
import { ProjectAvatar } from "../pages/dashboard/projects/_components/ProjectAvatar";

type Project = {
    name: string;
    imageUrl: string;
    projectId: string;
};

export const Projects = () => {
    const location = useLocation();
    const pathname=location.pathname;
    const workspaceId = useWorkspaceId();

    const { open } = useCreateProjectModal();
    // const { data } = useGetProjects({ workspaceId });
    const data = [
        {
            name: "test1 project",
            imageUrl: "",
            projectId: "123",
        },
        {
            name: "test2 project",
            imageUrl: "",
            projectId: "124",
        }
    ]

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Projects</p>
                <RiAddCircleFill
                    onClick={open}
                    className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
                />
            </div>
            {data?.map((project : Project) => {
                const href = `/workspaces/${workspaceId}/projects/${project.projectId}`;
                const isActive = pathname === href;
                return (
                    <Link to={href} key={project.projectId}>
                        <div
                            className={cn(
                                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                            )}
                        >
                            <ProjectAvatar image={project.imageUrl} name={project.name} />
                            <span className="truncate">{project.name}</span>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};