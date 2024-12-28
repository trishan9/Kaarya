import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as workspaceService from "./workspaces.service";
import { createWorkspaceSchema } from "./workspaces.validator";

import uploadToCloudinary from "@/lib/cloudinary";
import { ApiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { responseMessage } from "@/utils/responseMessage";
import { errorResponse } from "@/utils/errorMessage";

import { UserRoles } from "../member/member.validator";
import * as memberService from "../member/member.service";

export const createWorkspace = asyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body;
    const result = createWorkspaceSchema.safeParse(body);
    const userId = res.locals?.user?.id;

    if (!result.success) {
      throw new ApiError(StatusCodes.FORBIDDEN, result.error.issues);
    }

    const { name } = result.data;
    let imageUrl: string | null = null;

    if (req.file?.path) {
      const cloudinaryResponse = await uploadToCloudinary(req.file.path);
      if (cloudinaryResponse instanceof Error) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          errorResponse.WORKSPACE.IMAGE_FAIL,
        );
      }
      imageUrl = cloudinaryResponse?.secure_url;
    }

    const newWorkspaceObj = {
      name,
      userId,
      imageUrl,
    };

    const newWorkspace =
      await workspaceService.createWorkspace(newWorkspaceObj);

    const newMemberObject = {
      userId,
      workspaceId: newWorkspace.id,
      role: UserRoles.ADMIN,
    };

    await memberService.create(newMemberObject);

    return apiResponse(res, StatusCodes.OK, {
      workspace: newWorkspace,
      message: responseMessage.WORKSPACE.CREATED,
    });
  },
);

export const getWorkspaces = asyncHandler(async (_: Request, res: Response) => {
  const userId = res.locals.user.id;
  const workspaces = await workspaceService.getWorkspaces(userId);

  return apiResponse(res, StatusCodes.OK, {
    workspaces,
    message: responseMessage.WORKSPACE.RETRIEVED_ALL,
  });
});

export const getWorkspaceById = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      params: { workspaceId },
    } = req;

    const workspace = await workspaceService.getWorkspaceById(workspaceId);

    return apiResponse(res, StatusCodes.OK, {
      workspace,
      message: responseMessage.WORKSPACE.RETRIEVED,
    });
  },
);

export const updateWorkspace = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      body,
      params: { workspaceId },
    } = req;

    await workspaceService.updateWorkspace(workspaceId, body);

    return apiResponse(res, StatusCodes.OK, {
      message: responseMessage.WORKSPACE.UPDATED,
    });
  },
);

export const deleteWorkspace = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      params: { workspaceId },
    } = req;

    await workspaceService.deleteWokspace(workspaceId);

    return apiResponse(res, StatusCodes.OK, {
      message: responseMessage.WORKSPACE.DELETED,
    });
  },
);
