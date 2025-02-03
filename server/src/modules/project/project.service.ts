import { StatusCodes } from "http-status-codes";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Priority, TaskStatus } from "@prisma/client";

import { db } from "@/db";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";
import { capitalize, snakeCaseToTitleCase } from "@/utils";
import uploadToCloudinary from "@/lib/cloudinary";

import { CreateProjectInput } from "./project.validator";
import { UserRoles } from "../member/member.validator";
import { UpdateProjectType } from "./project.validator";

export const create = async (projectData: CreateProjectInput) => {
  const { workspaceId, image, userId, name } = projectData;

  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, errorResponse.USER.NOT_FOUND);
  }

  const exists = await db.project.findFirst({
    where: {
      name: name,
      workspaceId: workspaceId,
    },
  });

  if (exists) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      errorResponse.PROJECT.NAME_CONFLICT,
    );
  }

  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const hasAccess = await db.member.findFirst({
    where: {
      userId,
      workspaceId: workspaceId,
      OR: [{ role: UserRoles.ADMIN }, { userId: workspace.userId }],
    },
  });

  if (!hasAccess) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.WORKSPACE.NO_PERMISSION,
    );
  }

  let imageUrl: string | null = null;

  if (image) {
    const cloudinaryResponse = await uploadToCloudinary(image as string);
    if (cloudinaryResponse instanceof Error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorResponse.PROJECT.IMAGE_FAIL,
      );
    }
    imageUrl = cloudinaryResponse?.secure_url;
  }

  return await db.project.create({
    data: {
      name,
      imageUrl,
      workspaceId,
    },
  });
};

export const updateProject = async (
  projectId: string,
  userId: string,
  data: UpdateProjectType,
) => {
  if (!projectId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      workspace: true,
    },
  });

  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.PROJECT.INVALID);
  }

  const hasAccess = await db.member.findFirst({
    where: {
      userId,
      workspaceId: project.workspaceId,
      OR: [{ role: UserRoles.ADMIN }, { userId: project.workspace.userId }],
    },
  });

  if (!hasAccess) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.PROJECT.NO_PERMISSION,
    );
  }

  let imageUrl: string = project.imageUrl as string;
  if (data.image) {
    const cloudinaryResponse = await uploadToCloudinary(data.image as string);
    if (cloudinaryResponse instanceof Error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorResponse.PROJECT.IMAGE_FAIL,
      );
    }
    imageUrl = cloudinaryResponse?.secure_url;
  }

  const updatedData = {
    name: data.name,
    imageUrl,
  };

  return await db.project.update({
    where: {
      id: projectId,
    },
    data: updatedData,
    include: {
      workspace: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
    },
  });
};

export const getProjects = async (workspaceId: string, userId: string) => {
  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }
  const isMember = await db.member.findFirst({
    where: {
      userId,
      workspaceId,
    },
  });

  if (!isMember) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, errorResponse.PROJECT.ACCESS);
  }

  const projects = await db.project.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return projects;
};

export const deleteProject = async (projectId: string, userId: string) => {
  if (!projectId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    include: { workspace: true },
  });

  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.PROJECT.INVALID);
  }

  const hasAccess = await db.member.findFirst({
    where: {
      userId,
      workspaceId: project.workspaceId,
      OR: [{ role: UserRoles.ADMIN }, { userId: project.workspace.userId }],
    },
  });

  if (!hasAccess) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.PROJECT.NO_PERMISSION,
    );
  }

  return await db.project.delete({
    where: {
      id: projectId,
    },
  });
};

export const getProjectById = async (projectId: string, userId: string) => {
  if (!projectId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }
  const project = await db.project.findFirst({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.PROJECT.INVALID);
  }

  const isMember = await db.member.findFirst({
    where: {
      userId,
      workspaceId: project.workspaceId,
    },
  });

  if (!isMember) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.MEMBER.NOT_WORKSPACE_MEMBER,
    );
  }

  return project;
};

export const getProjectAnalyticsById = async (
  projectId: string,
  userId: string,
) => {
  if (!projectId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const project = await db.project.findFirst({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.PROJECT.INVALID);
  }

  const isMember = await db.member.findFirst({
    where: {
      userId,
      workspaceId: project.workspaceId,
    },
  });

  if (!isMember) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.MEMBER.NOT_WORKSPACE_MEMBER,
    );
  }

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const taskCounts = await db.task.groupBy({
    by: ["createdAt", "status", "assigneeId", "dueDate"],
    where: {
      projectId,
      createdAt: {
        gte: lastMonthStart, // Fetch data from last month and this month together
        lte: thisMonthEnd,
      },
    },
    _count: {
      id: true,
    },
  });

  let thisMonthCounts = {
    taskCount: 0,
    assignedTaskCount: 0,
    incompleteTaskCount: 0,
    completedTaskCount: 0,
    overdueTaskCount: 0,
  };

  let lastMonthCounts = {
    taskCount: 0,
    assignedTaskCount: 0,
    incompleteTaskCount: 0,
    completedTaskCount: 0,
    overdueTaskCount: 0,
  };

  taskCounts.forEach((task) => {
    const isThisMonth =
      task.createdAt >= thisMonthStart && task.createdAt <= thisMonthEnd;
    const isLastMonth =
      task.createdAt >= lastMonthStart && task.createdAt <= lastMonthEnd;

    if (isThisMonth || isLastMonth) {
      const targetMonth = isThisMonth ? thisMonthCounts : lastMonthCounts;

      targetMonth.taskCount += task._count.id;

      // Assigned task count (if assignee matches)
      if (task.assigneeId === isMember.id) {
        targetMonth.assignedTaskCount += task._count.id;
      }

      // Incomplete task count (status not completed)
      if (task.status !== TaskStatus.COMPLETED) {
        targetMonth.incompleteTaskCount += task._count.id;
      }

      if (task.status === TaskStatus.COMPLETED) {
        targetMonth.completedTaskCount += task._count.id;
      }

      // Overdue task count (dueDate < now and status not completed)
      if (task.dueDate < now && task.status !== TaskStatus.COMPLETED) {
        targetMonth.overdueTaskCount += task._count.id;
      }
    }
  });

  const taskDiff = thisMonthCounts.taskCount - lastMonthCounts.taskCount;
  const assignedTaskDiff =
    thisMonthCounts.assignedTaskCount - lastMonthCounts.assignedTaskCount;
  const incompleteTaskDiff =
    thisMonthCounts.incompleteTaskCount - lastMonthCounts.incompleteTaskCount;
  const completedTaskDiff =
    thisMonthCounts.completedTaskCount - lastMonthCounts.completedTaskCount;
  const overdueTaskDiff =
    thisMonthCounts.overdueTaskCount - lastMonthCounts.overdueTaskCount;

  const result = {
    taskCount: thisMonthCounts.taskCount,
    taskDiff,
    assignedTaskCount: thisMonthCounts.assignedTaskCount,
    assignedTaskDiff,
    incompleteTaskCount: thisMonthCounts.incompleteTaskCount,
    incompleteTaskDiff,
    completedTaskCount: thisMonthCounts.completedTaskCount,
    completeTaskDiff: completedTaskDiff,
    overdueTaskCount: thisMonthCounts.overdueTaskCount,
    overdueTaskDiff,
  };

  const [tasksPriority, tasksStatus] = await Promise.all([
    db.task.groupBy({
      by: ["priority"],
      where: { projectId },
      _count: { priority: true },
    }),
    db.task.groupBy({
      by: ["status"],
      where: { projectId },
      _count: { status: true },
    }),
  ]);

  const priorityCountMap = new Map(
    tasksPriority.map((p) => [p.priority, p._count.priority]),
  );
  const statusCountMap = new Map(
    tasksStatus.map((s) => [s.status, s._count.status]),
  );

  const tasksByPriority = Object.values(Priority).map((priority) => {
    return {
      name: capitalize(priority),
      taskCount: priorityCountMap.get(priority) || 0,
    };
  });

  const tasksByStatus = Object.values(TaskStatus).map((status) => {
    return {
      name: snakeCaseToTitleCase(status),
      taskCount: statusCountMap.get(status) || 0,
    };
  });

  return {
    analytics: {
      ...result,
      tasksByPriority,
      tasksByStatus,
    },
  };
};
