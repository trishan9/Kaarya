import { StatusCodes } from "http-status-codes";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@prisma/client";

import { db } from "@/db";
import uploadToCloudinary from "@/lib/cloudinary";
import { streamClient } from "@/lib/stream";
import {
  capitalize,
  generateInviteCode,
  INVITECODE_LENGTH,
  snakeCaseToTitleCase,
} from "@/utils";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";

import type {
  CreateWorkspaceInput,
  UpdateWorkspaceType,
} from "./workspace.validator";
import { UserRoles } from "../member/member.validator";

export const createWorkspace = async (data: CreateWorkspaceInput) => {
  if (!data.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, errorResponse.USER.NOT_FOUND);
  }

  const exists = await db.workspace.findFirst({
    where: {
      name: data.name,
      userId: data.userId,
    },
  });

  if (exists) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      errorResponse.WORKSPACE.NAME_CONFLICT,
    );
  }

  let imageUrl: string | null = null;

  if (data.image) {
    const cloudinaryResponse = await uploadToCloudinary(data.image as string);
    if (cloudinaryResponse instanceof Error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorResponse.WORKSPACE.IMAGE_FAIL,
      );
    }
    imageUrl = cloudinaryResponse?.secure_url;
  }

  const workspace = await db.workspace.create({
    data: {
      name: data.name,
      imageUrl: imageUrl,
      userId: data.userId,
      inviteCode: generateInviteCode(INVITECODE_LENGTH),
    },
  });

  const defaultChannels = ["general", "frontend", "backend", "others"];

  await Promise.all(
    defaultChannels.map(async (channel) => {
      await streamClient
        .channel("team", `${workspace.id}-${channel}`, {
          name: `${capitalize(channel)}`,
          created_by_id: data.userId,
          members: [data.userId],
          workspace_id: workspace.id,
        })
        .create();
    }),
  );

  return workspace;
};

export const getWorkspaces = async (userId: string) => {
  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, errorResponse.USER.NOT_FOUND);
  }

  const workspaces = await db.workspace.findMany({
    where: {
      members: {
        some: {
          userId: userId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!workspaces) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }
  return workspaces;
};

export const getWorkspaceById = async (workspaceId: string, userId: string) => {
  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const isMember = await db.member.findFirst({
    where: {
      userId,
      workspaceId,
    },
  });

  if (!isMember) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.WORKSPACE.UNAUTHORIZED,
    );
  }

  const transformedWorkspace = {
    ...workspace,
    members: workspace.members.map((member) => ({
      id: member.id,
      userId: member.userId,
      role: member.role,
      email: member.user.email,
      name: member.user.name,
      createdAt: member.createdAt,
    })),
  };

  return transformedWorkspace;
};

export const getWorkspaceInfoById = async (
  workspaceId: string,
  userId: string,
) => {
  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  return workspace;
};

export const getWorkspaceAnalyticsById = async (
  workspaceId: string,
  userId: string,
) => {
  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const isMember = await db.member.findFirst({
    where: {
      userId,
      workspaceId,
    },
  });

  if (!isMember) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.WORKSPACE.UNAUTHORIZED,
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
      workspaceId,
      createdAt: {
        gte: lastMonthStart,
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

    if (task._count && (isThisMonth || isLastMonth)) {
      const targetMonth = isThisMonth ? thisMonthCounts : lastMonthCounts;

      targetMonth.taskCount += task._count.id;

      if (task.assigneeId === isMember.id) {
        targetMonth.assignedTaskCount += task._count.id;
      }

      if (task.status !== TaskStatus.COMPLETED) {
        targetMonth.incompleteTaskCount += task._count.id;
      }

      if (task.status === TaskStatus.COMPLETED) {
        targetMonth.completedTaskCount += task._count.id;
      }

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

  const taskStatusGroups = await db.task.groupBy({
    by: ["status"],
    where: { workspaceId },
    _count: { status: true },
  });

  const completedTasks =
    taskStatusGroups.find((g) => g.status === TaskStatus.COMPLETED)?._count
      .status || 0;
  const notStartedTasks =
    taskStatusGroups.find((g) => g.status === TaskStatus.TODO)?._count.status ||
    0;
  const activeTasks = taskStatusGroups
    .filter((g) => !([TaskStatus.COMPLETED, TaskStatus.TODO] as TaskStatus[]).includes(g.status))
    .reduce((acc, g) => acc + (g._count?.status || 0), 0);

  const getDateRanges = (months: number) =>
    Array.from({ length: months }, (_, i) => {
      const date = subMonths(now, i);
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
        name: date.toLocaleString("default", { month: "short" }),
        monthLong: date.toLocaleString("default", { month: "long" }),
      };
    }).reverse();

  const last4Months = getDateRanges(4);
  const last6Months = getDateRanges(6).slice(0, 6);

  // Fetch base data in parallel
  const [projects, allTasks] = await Promise.all([
    db.project.findMany({
      where: { workspaceId },
      select: { id: true, name: true },
    }),
    db.task.findMany({
      where: { workspaceId },
      select: {
        id: true,
        status: true,
        projectId: true,
        assigneeId: true,
        createdAt: true,
      },
    }),
  ]);

  // Helper for counting tasks in memory
  const countTasks = (filter: (task: any) => boolean) =>
    allTasks.filter(filter).length;

  interface ProjectMonthlyData {
    name: string;
    total: number;
    completed: number;
  }

  // Monthly progress calculation
  const calculateMonthlyProgress = (months: typeof last4Months) => {
    const result: Record<string, ProjectMonthlyData[]> = { All: [] };

    // All projects data
    result.All = months.map((month) => ({
      name: month.name,
      total: countTasks(
        (t) => t.createdAt >= month.start && t.createdAt <= month.end,
      ),
      completed: countTasks(
        (t) =>
          t.status === TaskStatus.COMPLETED &&
          t.createdAt >= month.start &&
          t.createdAt <= month.end,
      ),
    }));

    // Per-project data
    projects.forEach((project) => {
      result[project.name] = months.map((month) => ({
        name: month.name,
        total: countTasks(
          (t) =>
            t.projectId === project.id &&
            t.createdAt >= month.start &&
            t.createdAt <= month.end,
        ),
        completed: countTasks(
          (t) =>
            t.projectId === project.id &&
            t.status === TaskStatus.COMPLETED &&
            t.createdAt >= month.start &&
            t.createdAt <= month.end,
        ),
      }));
    });

    return result;
  };

  // Task distribution calculations
  const projectsTaskDistribution = Object.values(TaskStatus).map((status) => ({
    status: snakeCaseToTitleCase(status),
    ...Object.fromEntries(
      projects.map((project) => [
        project.name,
        countTasks((t) => t.projectId === project.id && t.status === status),
      ]),
    ),
  }));

  const monthlyTaskDistribution = last6Months.map((month) => ({
    month: month.monthLong,
    taskCount: countTasks(
      (t) => t.createdAt >= month.start && t.createdAt <= month.end,
    ),
  }));

  const members = await db.member.findMany({
    where: { workspaceId },
    include: { user: true },
  });

  // Member contribution calculation
  const memberTaskContribution = members.map((member) => {
    const memberTasks = allTasks.filter((t) => t.assigneeId === member.id);
    const statusCounts = Object.values(TaskStatus).reduce(
      (acc, status) => {
        const statusTasks = memberTasks.filter((t) => t.status === status);

        acc[status] = {
          all: statusTasks.length,
          ...Object.fromEntries(
            projects.map((project) => [
              project.name,
              statusTasks.filter((t) => t.projectId === project.id).length,
            ]),
          ),
        };

        return acc;
      },
      {} as Record<string, any>,
    );

    return {
      member: member.user.name,
      ...Object.fromEntries(
        Object.entries(statusCounts).map(([status, counts]) => [
          snakeCaseToTitleCase(status),
          counts,
        ]),
      ),
    };
  });

  return {
    analytics: {
      ...result,
      taskCompletionOverview: {
        completedTasks,
        notStartedTasks,
        activeTasks,
      },
      monthlyTaskProgress: calculateMonthlyProgress(last4Months),
      monthlyTaskDistribution,
      projectsTaskDistribution,
      memberTaskContribution,
    },
  };
};

export const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  data: UpdateWorkspaceType,
) => {
  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const isAdmin = await db.member.findFirst({
    where: {
      userId,
      workspaceId,
      role: UserRoles.ADMIN,
    },
  });

  if (!isAdmin) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.WORKSPACE.NO_PERMISSION,
    );
  }

  let imageUrl: string = workspace.imageUrl as string;

  if (data.image) {
    const cloudinaryResponse = await uploadToCloudinary(data.image as string);
    if (cloudinaryResponse instanceof Error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorResponse.WORKSPACE.IMAGE_FAIL,
      );
    }
    imageUrl = cloudinaryResponse?.secure_url;
  }

  const updatedData = {
    name: data.name,
    imageUrl,
  };

  return await db.workspace.update({
    where: {
      id: workspaceId,
    },
    data: updatedData,
  });
};

export const deleteWorkspace = async (workspaceId: string, userId: string) => {
  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const isSuperAdmin = workspace.userId === userId;

  if (!isSuperAdmin) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.WORKSPACE.NO_PERMISSION,
    );
  }

  return await db.workspace.delete({
    where: {
      id: workspaceId,
    },
  });
};

export const resetWorkspaceInviteCode = async (
  workspaceId: string,
  userId: string,
) => {
  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const isAdmin = await db.member.findFirst({
    where: {
      userId,
      workspaceId,
      role: UserRoles.ADMIN,
    },
  });

  if (!isAdmin) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.WORKSPACE.NO_PERMISSION,
    );
  }

  return await db.workspace.update({
    where: {
      id: workspaceId,
    },
    data: {
      inviteCode: generateInviteCode(INVITECODE_LENGTH),
    },
  });
};

export const joinWorkspace = async (
  workspaceId: string,
  userId: string,
  inviteCode: string,
) => {
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const existingMember = await db.member.findFirst({
    where: {
      workspaceId,
      userId,
    },
  });

  if (existingMember) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      errorResponse.WORKSPACE.MEMBER_CONFLICT,
    );
  }

  if (workspace.inviteCode !== inviteCode) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.WORKSPACE.INVALID_INVITE_CODE,
    );
  }

  await db.member.create({
    data: {
      workspaceId,
      userId: userId,
      role: "MEMBER",
    },
  });

  await streamClient.upsertUser({
    id: userId,
  });

  const channels = await streamClient.queryChannels({
    type: "team",
    workspace_id: workspace.id,
  });

  await Promise.all(channels.map((channel) => channel.addMembers([userId])));

  const updatedWorkspace = await db.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: {
        include: { user: true },
      },
    },
  });

  return updatedWorkspace;
};
