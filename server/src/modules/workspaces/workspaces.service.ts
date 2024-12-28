import { StatusCodes } from "http-status-codes";

import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";
import { db } from "@/db";
import { UpdateWorkspaceType } from "./workspaces.validator";
import { generateInviteCode, INVITECODE_LENGTH } from "@/utils";

interface CreateWorkspaceInput {
  userId: string;
  imageUrl?: string | null;
  name: string;
}

export const createWorkspace = async (data: CreateWorkspaceInput) => {
  if (!data.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, errorResponse.USER.NOT_FOUND);
  }

  const newWorkspace = await db.workspace.create({
    data: {
      name: data.name,
      imageUrl: data.imageUrl,
      userId: data.userId,
      inviteCode: generateInviteCode(INVITECODE_LENGTH),
    },
  });

  return newWorkspace;
};

export const getWorkspaces = async (userId: string) => {
  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, errorResponse.USER.NOT_FOUND);
  }

  const workspaces = await db.workspace.findMany({
    where: {
      members: {
        some: {
          userId: userId,
        },
      },
    },
  });

  if (!workspaces) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const workspaceIds = workspaces.map((workspace) => workspace.id);

  return workspaceIds;
};

export const getWorkspaceById = async (workspaceId: string) => {};

export const updateWorkspace = async (
  workspaceId: string,
  data: UpdateWorkspaceType,
) => {};

export const deleteWokspace = async (workspaceId: string) => {};
