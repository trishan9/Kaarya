import { StatusCodes } from "http-status-codes";

import { db } from "@/db";
import { ApiError } from "@/utils/apiError";
import uploadToCloudinary from "@/lib/cloudinary";
import { errorResponse } from "@/utils/errorMessage";
import { CreateProjectInput } from "./project.validator";
import { UserRoles } from "../member/member.validator";
import { UpdateProjectType } from "./project.validator";

export const create = async (projectData: CreateProjectInput) => {
  const { workspaceId, image, userId, name } = projectData;
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const isSuperAdmin = workspace.userId === userId;

  if (!isSuperAdmin) {
    const member = await db.member.findFirst({
      where: {
        userId,
        workspaceId,
        role: UserRoles.ADMIN,
      },
    });

    if (!member) {
      throw new ApiError(StatusCodes.FORBIDDEN, errorResponse.NAME.INVALID);
    }
  }

  let imageUrl: string | null = null;
  if (image) {
    const cloudinaryResponse = await uploadToCloudinary(image as string);
    if (cloudinaryResponse instanceof Error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to upload image",
      );
    }
    imageUrl = cloudinaryResponse?.secure_url;
  }

  const newProject = await db.project.create({
    data: {
      name,
      imageUrl,
      workspaceId,
    },
  });
  return newProject;
};

export const updateProject = async (
  projectId: string,
  userId: string,
  data: UpdateProjectType,
) => {
  if (!projectId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      workspace: true,
    },
  });

  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.PROJECT.INVALID);
  }

  const member = await db.member.findFirst({
    where: {
      userId,
      workspaceId: project.workspaceId,
      OR: [{ role: UserRoles.ADMIN }, { userId: project.workspace.userId }],
    },
  });

  if (!member) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.PROJECT.NO_PERMISSION,
    );
  }

  let imageUrl: string = project.imageUrl as string;
  if (data.image) {
    const cloudinaryResponse = await uploadToCloudinary(data.image as string);
    if (cloudinaryResponse instanceof Error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorResponse.PROJECT.IMAGE_FAIL,
      );
    }
    imageUrl = cloudinaryResponse?.secure_url;
  }

  const updatedData = {
    name: data.name,
    imageUrl,
  };

  return await db.project.update({
    where: {
      id: projectId,
    },
    data: updatedData,
    include: {
      workspace: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
    },
  });
};

export const getProjects = async () => {
  return await db.project.findMany();
};

export const deleteProject = async (projectId: string, userId: string) => {
  if (!projectId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    include: { workspace: true },
  });

  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.PROJECT.INVALID);
  }

  const member = await db.member.findFirst({
    where: {
      userId,
      workspaceId: project.workspaceId,
      OR: [{ role: UserRoles.ADMIN }, { userId: project.workspace.userId }],
    },
  });

  if (!member) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.PROJECT.NO_PERMISSION,
    );
  }

  return await db.project.delete({
    where: {
      id: projectId,
    },
  });
};
