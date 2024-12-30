import { StatusCodes } from "http-status-codes";

import uploadToCloudinary from "@/lib/cloudinary";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";
import { db } from "@/db";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceType,
} from "./workspaces.validator";
import { generateInviteCode, INVITECODE_LENGTH } from "@/utils";
import { UserRoles } from "../member/member.validator";

export const createWorkspace = async (data: CreateWorkspaceInput) => {
  if (!data.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, errorResponse.USER.NOT_FOUND);
  }

  const exists = await db.workspace.findFirst({
    where: {
      name: data.name,
    },
  });

  if (exists) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      errorResponse.WORKSPACE.NAME_CONFLICT,
    );
  }

  let imageUrl: string | null = null;

  if (data.image) {
    const cloudinaryResponse = await uploadToCloudinary(data.image as string);
    if (cloudinaryResponse instanceof Error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorResponse.WORKSPACE.IMAGE_FAIL,
      );
    }
    imageUrl = cloudinaryResponse?.secure_url;
  }

  return await db.workspace.create({
    data: {
      name: data.name,
      imageUrl: imageUrl,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!workspaces) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  return workspaces;
};

export const getWorkspaceById = async (workspaceId: string, userId: string) => {
  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const isMember = await db.member.findFirst({
    where: {
      userId,
      workspaceId,
    },
  });

  if (!isMember) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.WORKSPACE.UNAUTHORIZED,
    );
  }

  return workspace;
};

export const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  data: UpdateWorkspaceType,
) => {
  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const isAdmin = await db.member.findFirst({
    where: {
      userId,
      workspaceId,
      role: UserRoles.ADMIN,
    },
  });

  if (!isAdmin) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.WORKSPACE.NO_PERMISSION,
    );
  }

  let imageUrl: string = workspace.imageUrl as string;

  if (data.image) {
    const cloudinaryResponse = await uploadToCloudinary(data.image as string);
    if (cloudinaryResponse instanceof Error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorResponse.WORKSPACE.IMAGE_FAIL,
      );
    }
    imageUrl = cloudinaryResponse?.secure_url;
  }

  const updatedData = {
    name: data.name,
    imageUrl,
  };

  return await db.workspace.update({
    where: {
      id: workspaceId,
    },
    data: updatedData,
  });
};

export const deleteWorkspace = async (workspaceId: string, userId: string) => {
  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const isSuperAdmin = workspace.userId === userId;

  if (!isSuperAdmin) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.WORKSPACE.NO_PERMISSION,
    );
  }

  return await db.workspace.delete({
    where: {
      id: workspaceId,
    },
  });
};
