import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";
import { apiResponse } from "@/utils/apiResponse";
import { responseMessage } from "@/utils/responseMessage";
import { asyncHandler } from "@/utils/asyncHandler";

import { createTaskSchema } from "./task.validator";
import * as taskServices from "./task.service";

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
    workspace: newTask,
    message: responseMessage.TASK.CREATED,
  });
});
