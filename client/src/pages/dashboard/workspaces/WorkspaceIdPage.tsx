import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { useGetProjects } from "@/hooks/useProjects";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { Chart1 } from "./charts/Chart1";
import {Chart2 } from "./charts/Chart2";
import { Chart3 } from "./charts/Chart3";
import { Chart4 } from "./charts/Chart4";
import { Analytics } from "../../../components/Analytics";
import { Chart5 } from "./charts/Chart5";
import { Project } from "../projects/_schemas";
import { Task } from "../tasks/_schemas";
import { useCreateTaskModal } from "@/hooks/useCreateTaskModal";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useCreateProjectModal } from "@/hooks/useCreateProjectModal";
import { ProjectAvatar } from "../projects/_components/ProjectAvatar";
import { Member } from "./_schemas";
import { MemberAvatar } from "./_components/MemberAvatar";
import { useGetTasks } from "@/hooks/useTasks";
import { useGetMembers } from "@/hooks/useMembers";

const analyticsData = {
    "analytics": {
        "taskCount": 1,
        "taskDiff": -14,
        "assignedTaskCount": 1,
        "assignedTaskDiff": -2,
        "incompleteTaskCount": 0,
        "incompleteTaskDiff": -14,
        "completedTaskCount": 1,
        "completeTaskDiff": 0,
        "overdueTaskCount": 0,
        "overdueTaskDiff": -14,
        "taskCompletionOverview": {
            "completedTasks": 2,
            "notStartedTasks": 6,
            "activeTasks": 8
        },
        "monthlyTaskProgress": {
            "All": [
                {
                    "name": "Nov",
                    "total": 0,
                    "completed": 0
                },
                {
                    "name": "Dec",
                    "total": 0,
                    "completed": 0
                },
                {
                    "name": "Jan",
                    "total": 15,
                    "completed": 1
                },
                {
                    "name": "Feb",
                    "total": 1,
                    "completed": 1
                }
            ],
            "Scool - TRS": [
                {
                    "name": "Nov",
                    "total": 0,
                    "completed": 0
                },
                {
                    "name": "Dec",
                    "total": 0,
                    "completed": 0
                },
                {
                    "name": "Jan",
                    "total": 14,
                    "completed": 1
                },
                {
                    "name": "Feb",
                    "total": 0,
                    "completed": 0
                }
            ],
            "आयु": [
                {
                    "name": "Nov",
                    "total": 0,
                    "completed": 0
                },
                {
                    "name": "Dec",
                    "total": 0,
                    "completed": 0
                },
                {
                    "name": "Jan",
                    "total": 1,
                    "completed": 0
                },
                {
                    "name": "Feb",
                    "total": 1,
                    "completed": 1
                }
            ]
        },
        "monthlyTaskDistribution": [
            {
                "month": "September",
                "taskCount": 0
            },
            {
                "month": "October",
                "taskCount": 0
            },
            {
                "month": "November",
                "taskCount": 0
            },
            {
                "month": "December",
                "taskCount": 0
            },
            {
                "month": "January",
                "taskCount": 15
            },
            {
                "month": "February",
                "taskCount": 1
            }
        ],
        "projectsTaskDistribution": [
            {
                "status": "Backlog",
                "Scool - TRS": 5,
                "आयु": 1
            },
            {
                "status": "Todo",
                "Scool - TRS": 1,
                "आयु": 0
            },
            {
                "status": "In Progress",
                "Scool - TRS": 5,
                "आयु": 0
            },
            {
                "status": "In Review",
                "Scool - TRS": 2,
                "आयु": 0
            },
            {
                "status": "Completed",
                "Scool - TRS": 1,
                "आयु": 1
            }
        ],
        "memberTaskContribution": [
            {
                "member": "Nischay Maharjan",
                "Backlog": {
                    "all": 2,
                    "Scool - TRS": 1,
                    "आयु": 1
                },
                "Todo": {
                    "all": 0,
                    "Scool - TRS": 0,
                    "आयु": 0
                },
                "In Progress": {
                    "all": 1,
                    "Scool - TRS": 1,
                    "आयु": 0
                },
                "In Review": {
                    "all": 1,
                    "Scool - TRS": 1,
                    "आयु": 0
                },
                "Completed": {
                    "all": 0,
                    "Scool - TRS": 0,
                    "आयु": 0
                }
            },
            {
                "member": "Trishan Wagle",
                "Backlog": {
                    "all": 1,
                    "Scool - TRS": 1,
                    "आयु": 0
                },
                "Todo": {
                    "all": 0,
                    "Scool - TRS": 0,
                    "आयु": 0
                },
                "In Progress": {
                    "all": 1,
                    "Scool - TRS": 1,
                    "आयु": 0
                },
                "In Review": {
                    "all": 1,
                    "Scool - TRS": 1,
                    "आयु": 0
                },
                "Completed": {
                    "all": 1,
                    "Scool - TRS": 0,
                    "आयु": 1
                }
            },
            {
                "member": "Smarika Pokharel",
                "Backlog": {
                    "all": 2,
                    "Scool - TRS": 2,
                    "आयु": 0
                },
                "Todo": {
                    "all": 0,
                    "Scool - TRS": 0,
                    "आयु": 0
                },
                "In Progress": {
                    "all": 1,
                    "Scool - TRS": 1,
                    "आयु": 0
                },
                "In Review": {
                    "all": 0,
                    "Scool - TRS": 0,
                    "आयु": 0
                },
                "Completed": {
                    "all": 0,
                    "Scool - TRS": 0,
                    "आयु": 0
                }
            },
            {
                "member": "Abiral Shrestha",
                "Backlog": {
                    "all": 1,
                    "Scool - TRS": 1,
                    "आयु": 0
                },
                "Todo": {
                    "all": 1,
                    "Scool - TRS": 1,
                    "आयु": 0
                },
                "In Progress": {
                    "all": 1,
                    "Scool - TRS": 1,
                    "आयु": 0
                },
                "In Review": {
                    "all": 0,
                    "Scool - TRS": 0,
                    "आयु": 0
                },
                "Completed": {
                    "all": 0,
                    "Scool - TRS": 0,
                    "आयु": 0
                }
            },
            {
                "member": "Nirjal Thapa",
                "Backlog": {
                    "all": 0,
                    "Scool - TRS": 0,
                    "आयु": 0
                },
                "Todo": {
                    "all": 0,
                    "Scool - TRS": 0,
                    "आयु": 0
                },
                "In Progress": {
                    "all": 1,
                    "Scool - TRS": 1,
                    "आयु": 0
                },
                "In Review": {
                    "all": 0,
                    "Scool - TRS": 0,
                    "आयु": 0
                },
                "Completed": {
                    "all": 1,
                    "Scool - TRS": 1,
                    "आयु": 0
                }
            }
        ]
    },
    "message": "Workspace data retrieved successfully."
}

export const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: projectsLoading } = useGetProjects({
    workspaceId,
  });

  // const { data: analytics, isLoading: analyticsLoading } =
  // useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: tasksLoading } = useGetTasks({
    workspaceId,
  });

  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  const isLoading = tasksLoading || projectsLoading || membersLoading;

  if (isLoading) return <PageLoader />;

  if (!tasks || !projects || !members)
		return <PageError message="Failed to load workspace data" />;

  return (
    <>
      <div className="mb-8 flex flex-col">
        <Analytics data={analyticsData?.analytics} />
      </div>
      
      <div className="2xl:grid xl:grid-cols-8 xl:gap-x-7 xl:grid">
          <div className="mb-8 xl:col-span-3">
            <Chart1 data= {analyticsData.analytics.taskCompletionOverview} />
          </div>

          <div className="mb-8 xl:col-span-5">
            <Chart2 projectsData= {analyticsData.analytics.monthlyTaskProgress} />
          </div>

          <div className="mb-8 xl:col-span-4">
            <Chart3 chartData= {analyticsData.analytics.monthlyTaskDistribution} />
          </div>

          <div className="mb-8 xl:col-span-4">
            <Chart4 taskData= {analyticsData.analytics.projectsTaskDistribution} />
          </div>

          <div className="mb-8 xl:col-span-8">
            <Chart5 memberData={analyticsData.analytics.memberTaskContribution}/>
          </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
				<TaskList data={tasks?.tasks.tasks.slice(0,3)} total={tasks?.tasks?.total} />
				<ProjectList data={projects?.data?.projects} total={projects?.data?.projects?.length} />
				<MembersList data={members?.data?.workspace?.members} total={members?.data?.workspace?.members.length} />
			</div>
    </>
  );
};

interface TaskListProps {
	data: Task[];
	total: number;
}
export const TaskList = ({ data, total }: TaskListProps) => {
	const { open: createTask } = useCreateTaskModal();
	const workspaceId = useWorkspaceId();

	return (
		<div className="flex flex-col gap-y-4 col-span-1">
			<div className="border rounded-lg p-4">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">Tasks ({total})</p>
					<Button variant="outline" size="icon" onClick={createTask}>
						<PlusIcon className="size-4 text-neutral-400" />
					</Button>
				</div>
				<DottedSeparator className="my-4" />
				<ul className="flex flex-col gap-y-4">
					{data.map((task) => (
						<li key={task.id}>
							<Link to={`/workspaces/${workspaceId}/tasks/${task.id}`}>
								<Card className="shadow-none rounded-lg transition hover:bg-neutral-50 bg-neutral-100/10">
									<CardContent className="p-4">
										<p className="text-lg font-medium truncate">{task.name}</p>
										<div className="flex items-center gap-x-2">
											<p>{task.project?.name}</p>
											<div className="dot" />
											<div className="text-sm text-muted-foreground flex items-center">
												<CalendarIcon className="size-3 mr-1" />
												<span className="truncate">
													{formatDistanceToNow(new Date(task.dueDate))}
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</Link>
						</li>
					))}
					<li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
						No tasks found
					</li>
				</ul>
				<Button variant="outline" className="mt-4 w-full" asChild>
					<Link to={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
				</Button>
			</div>
		</div>
	);
};

interface ProjectListProps {
	data: Project[];
	total: number;
}
export const ProjectList = ({ data, total }: ProjectListProps) => {
	const { open: createProject } = useCreateProjectModal();
	const workspaceId = useWorkspaceId();

	return (
		<div className="flex flex-col gap-y-4 col-span-1">
			<div className="bg-white border rounded-lg p-4">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">Projects ({total})</p>
					<Button variant="secondary" size="icon" onClick={createProject}>
						<PlusIcon className="size-4 text-neutral-400" />
					</Button>
				</div>
				<DottedSeparator className="my-4" />
				<ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{data.map((project) => (
						<li key={project.id}>
							<Link to={`/workspaces/${workspaceId}/projects/${project.id}`}>
								<Card className="shadow-none rounded-lg hover:opacity-75 transition">
									<CardContent className="p-4 flex items-center gap-x-2.5">
										<ProjectAvatar
											className="size-12"
											fallbackClassName="text-lg"
											name={project.name}
											image={project.imageUrl}
										/>
										<p className="text-lg font-medium truncate">
											{project.name}
										</p>
									</CardContent>
								</Card>
							</Link>
						</li>
					))}
					<li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
						No projects found
					</li>
				</ul>
			</div>
		</div>
	);
};

interface MembersListProps {
	data: Member[];
	total: number;
}
export const MembersList = ({ data, total }: MembersListProps) => {
	const workspaceId = useWorkspaceId();

	return (
		<div className="flex flex-col gap-y-4 col-span-1">
			<div className="bg-white border rounded-lg p-4">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">Members ({total})</p>
					<Button asChild variant="secondary" size="icon">
						<Link to={`/workspaces/${workspaceId}/members`}>
							<SettingsIcon className="size-4 text-neutral-400" />
						</Link>
					</Button>
				</div>
				<DottedSeparator className="my-4" />
				<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{data.map((member) => (
						<li key={member.id}>
							<Card className="shadow-none rounded-lg overflow-hidden">
								<CardContent className="p-3 flex-col flex items-center gap-x-2">
									<MemberAvatar className="size-12" name={member.name} />
									<div className="flex flex-col items-center overflow-hidden">
										<p className="text-lg font-medium line-clamp-1">
											{member.name}
										</p>
										<p className="text-sm text-muted-foreground line-clamp-1">
											{member.email}
										</p>
									</div>
								</CardContent>
							</Card>
						</li>
					))}
					<li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
						No members found
					</li>
				</ul>
			</div>
		</div>
	);
};

