"use client";
import { Pencil } from "lucide-react";
import { Link, useLocation } from "react-router";

import { ProjectAvatar } from "./_components/ProjectAvatar";
import { TaskViewSwitcher } from "../tasks/_components/TaskViewSwitcher";

import { Button } from "@/components/ui/button";
import { Project } from "./_schemas/index";

// import { useProjectId } from "@/hooks/userProjectId";
// import { useGetProject } from "@/features/projects/api/use-get-project";
// import { PageLoader } from "@/components/PageLoader";
// import { PageError } from "@/components/PageError";
// import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
// import { Analytics } from "@/components/";



export const ProjectIdPage : React.FC = () => {

    const project: Project = {
        name: "test project",
        imageUrl: "",
        projectId: "123",
    };

    const location = useLocation()
    const pathname=location.pathname

    // const projectId = useProjectId();


    // const { data: project, isLoading: projectsLoading } = useGetProject({
    //     projectId,
    // });
    // const { data: analytics, isLoading: analyticsLoading } =
    //     useGetProjectAnalytics({ projectId });

    // const isLoading = projectsLoading || analyticsLoading;

    // if (isLoading) return <PageLoader />;
    // if (!project) return <PageError message="Project not found" />;

    const href = `${pathname}/settings`;

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <ProjectAvatar
                        name={project.name}
                        image={project.imageUrl}
                        className="size-8"
                    />
                    <p className="text-lg font-semibold">{project.name}</p>
                </div>
                <Button variant="outline" size="default" asChild>
                    <Link to={href}>
                        <Pencil className="size-4 mr-2" />
                        Edit Project
                    </Link>
                </Button>
            </div>
            {/* {analytics ? <Analytics data={analytics} /> : null} */}
            <TaskViewSwitcher hideProjectFilter />
        </div>
    );
};