import { StatusCodes } from "http-status-codes";

import { db } from "@/db";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";

import { CreateTaskSchema, Priority, TaskStatus } from "./task.validator";
import { Prisma } from "@prisma/client";

interface GetTasksParams {
  workspaceId: string;
  projectId?: string;
  assigneeId?: string;
  search?: string;
  dueDate?: string;
  status?: TaskStatus;
  priority?: Priority;
}

export const getTasks = async (params: GetTasksParams, userId: string) => {
  const {
    workspaceId,
    projectId,
    assigneeId,
    status,
    priority,
    search,
    dueDate,
  } = params;

  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const hasAccess = await db.member.findFirst({
    where: {
      userId,
      workspaceId,
    },
  });

  if (!hasAccess) {
    throw new ApiError(StatusCodes.FORBIDDEN, errorResponse.TASK.NO_PERMISSION);
  }

  const whereClause: Prisma.TaskWhereInput = {
    workspaceId,
    ...(projectId && { projectId }),
    ...(status && { status }),
    ...(priority && { priority }),
    ...(assigneeId && { assigneeId }),
    ...(dueDate && { dueDate: new Date(dueDate) }),
    ...(search && {
      name: {
        contains: search,
        mode: "insensitive",
      },
    }),
  };

  const tasks = await db.task.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
      assignee: {
        select: {
          id: true,
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const transformedTasks = tasks.map((task) => ({
    id: task.id,
    name: task.name,
    description: task.description,
    status: task.status,
    priority: task.priority,
    position: task.position,
    dueDate: task.dueDate,
    sprint: task.sprint,
    storyPoints: task.storyPoints,
    projectId: task.projectId,
    workspaceId: task.workspaceId,
    assigneeId: task.assigneeId,
    createdAt: task.createdAt,
    project: {
      id: task.project.id,
      name: task.project.name,
      imageUrl: task.project.imageUrl,
    },
    assignee: {
      id: task.assignee.id,
      role: task.assignee.role,
      name: task.assignee.user.name,
      email: task.assignee.user.email,
    },
  }));

  return {
    total: tasks.length,
    tasks: transformedTasks,
  };
};

export const create = async (taskData: CreateTaskSchema, userId: string) => {
  const {
    name,
    status,
    dueDate,
    priority,
    sprint,
    storyPoints,
    projectId,
    assigneeId,
    workspaceId,
  } = taskData;

  if (!projectId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const hasAccess = await db.member.findFirst({
    where: {
      userId,
      workspaceId: workspaceId,
    },
  });

  if (!hasAccess) {
    throw new ApiError(StatusCodes.FORBIDDEN, errorResponse.TASK.NO_PERMISSION);
  }

  const newPosition =
    (
      await db.task.findFirst({
        where: { status, workspaceId },
        orderBy: { position: "desc" },
      })
    )?.position ?? 0 + 1000;

  return await db.task.create({
    data: {
      name,
      status,
      dueDate,
      priority,
      sprint,
      storyPoints,
      projectId,
      assigneeId,
      workspaceId,
      position: newPosition,
    },
  });
};
