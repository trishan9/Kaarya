"use client";
import { Link } from "react-router";
import { useLocation } from "react-router"; 
import { RiAddCircleFill } from "react-icons/ri";

import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useCreateProjectModal } from "@/hooks/useCreateProjectModal";
import { ProjectAvatar } from "../pages/dashboard/projects/_components/ProjectAvatar";
import { useGetProjects } from "@/hooks/useProjects";

type Project = {
    name: string;
    imageUrl: string;
    id: string;
};

export const Projects = () => {
    const location = useLocation();
    const pathname=location.pathname;
    const workspaceId = useWorkspaceId();

    const { open } = useCreateProjectModal();
    const { data } = useGetProjects({ workspaceId });

    const projects = data?.data.projects

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Projects</p>
                
                <RiAddCircleFill
                    onClick={open}
                    className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
                />
            </div>
            {projects?.map((project : Project) => {
                const href = `/workspaces/${workspaceId}/projects/${project.id}`;
                const isActive = pathname === href;
                return (
                    <Link to={href} key={project.id}>
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