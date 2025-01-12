import { StatusCodes } from "http-status-codes";

import { db } from "@/db";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";

import { CreateTaskSchema } from "./task.validator";

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
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.PROJECT.NO_PERMISSION,
    );
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
