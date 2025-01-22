import { Pencil } from "lucide-react";
import { Link, useLocation } from "react-router";
import { ProjectAvatar } from "./_components/ProjectAvatar";
import { TaskViewSwitcher } from "../tasks/_components/TaskViewSwitcher";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/hooks/useProjects";
import { useProjectId } from "@/hooks/useProjectId";
import { PageLoader } from "@/components/PageLoader";
import { PageError } from "@/components/PageError";
import { Analytics } from "../../../components/Analytics";
import { Chart1 } from "./charts/Chart1";
import { Chart2 } from "./charts/Chart2";

const analyticsData = {
  "analytics": {
      "taskCount": 0,
      "taskDiff": -14,
      "assignedTaskCount": 0,
      "assignedTaskDiff": -3,
      "incompleteTaskCount": 0,
      "incompleteTaskDiff": -14,
      "completedTaskCount": 0,
      "completeTaskDiff": 0,
      "overdueTaskCount": 0,
      "overdueTaskDiff": -14,
      "tasksByPriority": [
          {
              "name": "Low",
              "taskCount": 2
          },
          {
              "name": "Medium",
              "taskCount": 9
          },
          {
              "name": "High",
              "taskCount": 3
          }
      ],
      "tasksByStatus": [
          {
              "name": "Backlog",
              "taskCount": 5
          },
          {
              "name": "Todo",
              "taskCount": 1
          },
          {
              "name": "In Progress",
              "taskCount": 5
          },
          {
              "name": "In Review",
              "taskCount": 3
          },
          {
              "name": "Completed",
              "taskCount": 0
          }
      ]
  },
  "message": "The project data has been retrieved successfully."
}

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

  // const analyticsData = {
  //   taskCount: 120,
  //   taskDiff: 10, 

  //   assignedTaskCount: 80,
  //   assignedTaskDiff: 5,

  //   completedTaskCount: 60,
  //   completeTaskDiff: 8,

  //   overdueTaskCount: 15,
  //   overdueTaskDiff: -2,

  //   incompleteTaskCount: 45,
  //   incompleteTaskDiff: 3,
  // };

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
      
      <Analytics data={analyticsData?.analytics}/>

      <div className="2xl:grid xl:grid-cols-8 xl:gap-x-7 xl:grid mt-3">
        <div className="mb-4 xl:col-span-3">
          <Chart1 data= {analyticsData.analytics.tasksByPriority}/>
        </div>
      
        <div className="xl:col-span-5">
          <Chart2 chartData= {analyticsData.analytics.tasksByStatus}/>
        </div>
      </div>

      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
