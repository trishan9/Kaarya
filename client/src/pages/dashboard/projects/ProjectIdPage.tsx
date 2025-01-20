import { Pencil } from "lucide-react";
import { Link, useLocation } from "react-router";
import { ProjectAvatar } from "./_components/ProjectAvatar";
import { TaskViewSwitcher } from "../tasks/_components/TaskViewSwitcher";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/hooks/useProjects";
import { useProjectId } from "@/hooks/useProjectId";
import { PageLoader } from "@/components/PageLoader";
import { PageError } from "@/components/PageError";

export const ProjectIdPage: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const projectId = useProjectId();

  const { data, isLoading: projectsLoading } = useGetProject({
    projectId,
  });

  const project = data?.data.project;

  if (projectsLoading) return <PageLoader />;
  if (!project) return <PageError message="Project not found" />;

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

        <div>
          <Button variant="outline" size="default" asChild>
            <Link to={href}>
              <Pencil className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>

      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
