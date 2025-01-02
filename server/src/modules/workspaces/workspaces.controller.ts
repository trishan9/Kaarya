import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as workspaceService from "./workspaces.service";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "./workspaces.validator";

import { ApiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { responseMessage } from "@/utils/responseMessage";
import { errorResponse } from "@/utils/errorMessage";

import { UserRoles } from "../member/member.validator";
import * as memberService from "../member/member.service";
import { db } from "@/db";

export const createWorkspace = asyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body;
    const result = createWorkspaceSchema.safeParse(body);
    const userId = res.locals?.user?.id;

    if (!result.success) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        errorResponse.VALIDATION.FAILED,
      );
    }

    const { name } = body;
    const image = req.file?.path;

    const newWorkspaceObj = {
      name,
      userId,
      image,
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

    const workspace = await workspaceService.getWorkspaceById(
      workspaceId,
      res.locals.user.id,
    );

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

    const result = updateWorkspaceSchema.safeParse(body);

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

    const workspace = await workspaceService.updateWorkspace(
      workspaceId,
      res.locals.user.id,
      data,
    );

    return apiResponse(res, StatusCodes.OK, {
      workspace,
      message: responseMessage.WORKSPACE.UPDATED,
    });
  },
);

export const deleteWorkspace = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      params: { workspaceId },
    } = req;

    await workspaceService.deleteWorkspace(workspaceId, res.locals.user.id);

    return apiResponse(res, StatusCodes.OK, {
      message: responseMessage.WORKSPACE.DELETED,
    });
  },
);


export const resetWorkspaceLink = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      params: { workspaceId },
    } = req;
    const userId = res.locals.user.id;

    const workspace = await workspaceService.resetWorkspaceInviteCode(
      workspaceId,
      userId
    );

    return apiResponse(res, StatusCodes.OK, {
      workspace,
      message: responseMessage.WORKSPACE.INVITE_CODE_RESET,
    });
  }
);

export const inviteToWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { inviteCode } = req.body;
  const userId = res.locals.user.id;

  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId }
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Workspace not found");
  }

  const existingMember = await db.member.findFirst({
    where: {
      workspaceId,
      userId,
    }
  });

  if (existingMember) {
    throw new ApiError(StatusCodes.CONFLICT, "Already a member of this workspace");
  }

  if (workspace.inviteCode !== inviteCode) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid invite code");
  }

  await db.member.create({
    data: {
      workspaceId,
      userId: userId,
      role: "MEMBER"
    }
  });

  const updatedWorkspace = await db.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: {
        include: { user: true }
      }
    }
  });

  return apiResponse(res, StatusCodes.OK, {
    workspace: updatedWorkspace,
    message: "Successfully joined workspace"

  })
})


