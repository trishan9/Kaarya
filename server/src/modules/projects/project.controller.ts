import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ApiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { errorResponse } from "@/utils/errorMessage";
import * as projectServices from "./project.services";
import { createProjectSchema, updateProjectSchema } from "./project.validator";
import { responseMessage } from "@/utils/responseMessage";

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
    const { workspaceId } = req.params;
    const userId = res.locals?.user.id;
    const projects = await projectServices.getProjects(workspaceId, userId);
    return apiResponse(res, StatusCodes.OK, {
      projects,
      message: "All projects retrived successfully",
    });
  },
);

export const updateProject = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      body,
      params: { projectId },
    } = req;
    const userId = res.locals?.user?.id;

    const result = updateProjectSchema.safeParse(body);
    if (!result.success) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        errorResponse.VALIDATION.FAILED,
      );
    }

    const { name } = body;
    const image = req.file?.path;

    const data = {
      name,
      image,
    };

    const project = await projectServices.updateProject(
      projectId,
      userId,
      data,
    );

    return apiResponse(res, StatusCodes.OK, {
      project,
      message: responseMessage.PROJECT.UPDATED,
    });
  },
);

export const deleteProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      params: { projectId },
    } = req;

    const deletedProject = await projectServices.deleteProject(
      projectId,
      res.locals.user.id,
    );

    return apiResponse(res, StatusCodes.OK, {
      deletedProject,
      message: responseMessage.PROJECT.DELETED,
    });
  },
);
