import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as workspaceService from "./workspace.service"
import { createWorkspaceSchema } from "./workspace.validator";
import { ApiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { responseMessage } from "@/utils/responseMessage";
import { Role } from "../members/members.validator";
import uploadToCloudinary from "@/lib/cloudinary";
import * as memberService from "../members/members.service"


export const createWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const result = createWorkspaceSchema.safeParse(body);
  const userId = res.locals?.user?.id;

  if (!result.success) {
    throw new ApiError(StatusCodes.FORBIDDEN, result.error.issues);
  }

  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "User not authenticated");
  }

  const { name } = result.data;
  let imageUrl: string | null = null;

  if (req.file?.path) {
    const cloudinaryResponse = await uploadToCloudinary(req.file.path);
    if (cloudinaryResponse instanceof Error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Image upload failed');
    }
    imageUrl = cloudinaryResponse?.secure_url;
  }

  const newWorkspaceObj = {
    name,
    userId,
    imageUrl
  };

  const newWorkspace = await workspaceService.create(newWorkspaceObj);

  const newMemberObject = {
    userId,
    workspaceId: newWorkspace.id,
    role: Role.ADMIN,
  };

  const newMember = await memberService.create(newMemberObject);

  return apiResponse(res, StatusCodes.OK, {
    newWorkspace,
    newMember,
    message: responseMessage.WORKSPACE.CREATED
  });
});
export const updateWorkspace = asyncHandler(async (req: Request, res: Response) => {

  return apiResponse(res, StatusCodes.OK, {
    message: responseMessage.WORKSPACE.UPDATED
  })
})

export const getWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const userId = res.locals.user.id;

  const workspaces = await workspaceService.get(userId);
  return apiResponse(res, StatusCodes.OK, {
    workspaces,
    message: responseMessage.WORKSPACE.RETRIEVED
  });
});
