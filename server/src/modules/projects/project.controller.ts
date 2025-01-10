import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";
import { createProjectSchema } from "./project.validator";

import * as projectServices from "./project.services";

export const createProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals?.user?.id;
    const body = req.body;

    const result = createProjectSchema.safeParse(body);

    if (!result.success) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        errorResponse.VALIDATION.FAILED,
      );
    }
    const { name, workspaceId } = body;
    const image = req.file?.path;

    const createProjectObj = {
      name,
      userId,
      workspaceId,
      image,
    };
    const newProject = await projectServices.create(createProjectObj);
    return apiResponse(res, StatusCodes.CREATED, {
      project: newProject,
      message: "Project created successfully",
    });
  },
);

export const getAllProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const projects = await projectServices.getProjects();
    return apiResponse(res, StatusCodes.OK, {
      projects,
      message: "All projects retrived successfully",
    });
  },
);
