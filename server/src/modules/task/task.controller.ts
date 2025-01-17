import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";
import { apiResponse } from "@/utils/apiResponse";
import { responseMessage } from "@/utils/responseMessage";
import { asyncHandler } from "@/utils/asyncHandler";

import {
  bulkUpdateTasksSchema,
  createTaskSchema,
  getTasksSchema,
  updateTaskSchema,
} from "./task.validator";
import * as taskServices from "./task.service";

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query;
  const userId = res.locals?.user?.id;
  const result = getTasksSchema.safeParse(query);

  if (!result.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const tasks = await taskServices.getTasks(result.data, userId);

  return apiResponse(res, StatusCodes.OK, {
    tasks,
    message: responseMessage.TASK.FETCHED,
  });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const result = createTaskSchema.safeParse(body);
  const userId = res.locals?.user?.id;

  if (!result.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const newTask = await taskServices.create(result?.data, userId);

  return apiResponse(res, StatusCodes.OK, {
    task: newTask,
    message: responseMessage.TASK.CREATED,
  });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { taskId },
  } = req;
  const userId = res.locals.user.id;

  const deletedTask = await taskServices.deleteTask(taskId, userId);

  return apiResponse(res, StatusCodes.OK, {
    deletedTask,
    message: responseMessage.TASK.DELETED,
  });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const {
    body,
    params: { taskId },
  } = req;
  const userId = res.locals?.user?.id;
  const result = updateTaskSchema.safeParse(body);

  if (!result.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const task = await taskServices.updateTask(taskId, userId, result.data);

  return apiResponse(res, StatusCodes.OK, {
    task,
    message: responseMessage.TASK.UPDATED,
  });
});

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const userId = res.locals?.user.id;

  const task = await taskServices.getTask(taskId, userId);

  return apiResponse(res, StatusCodes.OK, {
    task,
    message: responseMessage.TASK.FETCHED,
  });
});

export const bulkUpdateTasks = asyncHandler(
  async (req: Request, res: Response) => {
    const { body } = req;
    const userId = res.locals?.user?.id;

    const result = bulkUpdateTasksSchema.safeParse(body);

    if (!result.success) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        errorResponse.VALIDATION.FAILED,
      );
    }

    const tasks = await taskServices.bulkUpdateTasks(result.data.tasks, userId);

    return apiResponse(res, StatusCodes.OK, {
      tasks,
      message: responseMessage.TASK.UPDATED,
    });
  },
);
