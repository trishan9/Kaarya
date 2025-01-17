import { StatusCodes } from "http-status-codes";

import { db } from "@/db";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";

import {
  BulkUpdateTasksType,
  CreateTaskSchema,
  Priority,
  TaskStatus,
  UpdateTaskType,
} from "./task.validator";
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

export const deleteTask = async (taskId: string, userId: string) => {
  if (!taskId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const task = await db.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      workspace: true,
    },
  });

  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.TASK.INVALID);
  }

  const hasAccess = await db.member.findFirst({
    where: {
      userId,
      workspaceId: task.workspaceId,
    },
  });

  if (!hasAccess) {
    throw new ApiError(StatusCodes.FORBIDDEN, errorResponse.TASK.NO_PERMISSION);
  }

  return await db.task.delete({
    where: {
      id: taskId,
    },
  });
};

export const updateTask = async (
  taskId: string,
  userId: string,
  data: UpdateTaskType,
) => {
  if (!taskId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const task = await db.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      workspace: true,
    },
  });

  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.TASK.INVALID);
  }

  const hasAccess = await db.member.findFirst({
    where: {
      userId,
      workspaceId: task.workspaceId,
    },
  });

  if (!hasAccess) {
    throw new ApiError(StatusCodes.FORBIDDEN, errorResponse.TASK.NO_PERMISSION);
  }

  return await db.task.update({
    where: {
      id: taskId,
    },
    data: {
      name: data.name,
      status: data.status,
      dueDate: data.dueDate,
      projectId: data.projectId,
      assigneeId: data.assigneeId,
      description: data.description,
      priority: data.priority,
      sprint: data.sprint,
      storyPoints: data.storyPoints,
    },
    include: {
      project: {
        select: {
          name: true,
        },
      },
      assignee: {
        select: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const getTask = async (taskId: string, userId: string) => {
  if (!taskId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const task = await db.task.findFirst({
    where: {
      id: taskId,
    },
    include: {
      project: true,
      assignee: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.TASK.INVALID);
  }

  const currentMember = await db.member.findFirst({
    where: {
      userId,
      workspaceId: task.workspaceId,
    },
  });

  if (!currentMember) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.MEMBER.NOT_WORKSPACE_MEMBER,
    );
  }

  return {
    ...task,
    assignee: {
      ...task.assignee,
      name: task.assignee.user.name || task.assignee.user.email,
      email: task.assignee.user.email,
    },
  };
};

export const bulkUpdateTasks = async (
  tasks: BulkUpdateTasksType["tasks"],
  userId: string,
) => {
  if (!tasks.length || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const taskIds = tasks.map((task) => task.id);

  const existingTasks = await db.task.findMany({
    where: {
      id: {
        in: taskIds,
      },
    },
    include: {
      workspace: true,
    },
  });

  if (existingTasks.length !== taskIds.length) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.TASK.INVALID);
  }

  const workspaceIds = new Set(existingTasks.map((task) => task.workspaceId));
  if (workspaceIds.size !== 1) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.TASK.INVALID_WORKSPACE,
    );
  }

  const workspaceId = existingTasks[0].workspaceId;

  const hasAccess = await db.member.findFirst({
    where: {
      userId,
      workspaceId,
    },
  });

  if (!hasAccess) {
    throw new ApiError(StatusCodes.FORBIDDEN, errorResponse.TASK.NO_PERMISSION);
  }

  return await db.$transaction(
    tasks.map((task) =>
      db.task.update({
        where: {
          id: task.id,
        },
        data: {
          status: task.status,
          position: task.position,
        },
        include: {
          project: {
            select: {
              name: true,
            },
          },
          assignee: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
    ),
  );
};
