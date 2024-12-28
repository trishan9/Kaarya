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

  return await db.workspace.create({
    data: {
      name: data.name,
      imageUrl: data.imageUrl,
      userId: data.userId,
      inviteCode: generateInviteCode(INVITECODE_LENGTH),
    },
  });
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

export const getWorkspaceById = async (workspaceId: string, userId: string) => {
  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.WORKSPACE.INVALID,
    );
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    include: {
      members: true,
    },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const isMember = workspace.members.some((member) => member.userId === userId);

  if (!isMember) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.AUTH_HEADER.UNAUTHORIZED,
    );
  }

  return workspace;
};

export const updateWorkspace = async (
  workspaceId: string,
  data: UpdateWorkspaceType,
) => {};

export const deleteWorkspace = async (workspaceId: string, userId: string) => {
  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.WORKSPACE.INVALID,
    );
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    include: {
      members: true,
    },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const isSuperAdmin = workspace.userId === userId;

  if (!isSuperAdmin) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.AUTH_HEADER.UNAUTHORIZED,
    );
  }

  return await db.workspace.delete({
    where: {
      id: workspaceId,
    },
  });
};
