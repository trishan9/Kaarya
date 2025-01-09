"use client";
// import { useProjectId } from "@/hooks/userProjectId";
// import { useGetProject } from "@/features/projects/api/use-get-project";
import { EditProjectForm } from "./_components/EditProjectForm";
import { type Project } from "./_schemas/index";

// import { PageLoader } from "@/components/PageLoader";
// import { PageError } from "@/components/PageError";

export const ProjectIdSettingsPage = () => {

    const project: Project = {
        name: "test project",
        imageUrl: "",
        projectId: "123",
    };
    // const projectId = useProjectId();
    // const { data: initialValues, isLoading } = useGetProject({ projectId });

    // if (isLoading) return <PageLoader />;
    // if (!initialValues) return <PageError message="Project not found" />;

    return (
        <div className="w-full lg:max-w-xl">
            <EditProjectForm initialValues={project} />
        </div>
    );
};