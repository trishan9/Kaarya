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

  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, errorResponse.USER.NOT_FOUND);
  }

  const exists = await db.project.findFirst({
    where: {
      name: name,
    },
  });

  if (exists) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      errorResponse.PROJECT.NAME_CONFLICT,
    );
  }

  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }

  const hasAccess = await db.member.findFirst({
    where: {
      userId,
      workspaceId: workspaceId,
      OR: [{ role: UserRoles.ADMIN }, { userId: workspace.userId }],
    },
  });

  if (!hasAccess) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.WORKSPACE.NO_PERMISSION,
    );
  }

  let imageUrl: string | null = null;

  if (image) {
    const cloudinaryResponse = await uploadToCloudinary(image as string);
    if (cloudinaryResponse instanceof Error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorResponse.PROJECT.IMAGE_FAIL,
      );
    }
    imageUrl = cloudinaryResponse?.secure_url;
  }

  return await db.project.create({
    data: {
      name,
      imageUrl,
      workspaceId,
    },
  });
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

  const hasAccess = await db.member.findFirst({
    where: {
      userId,
      workspaceId: project.workspaceId,
      OR: [{ role: UserRoles.ADMIN }, { userId: project.workspace.userId }],
    },
  });

  if (!hasAccess) {
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

export const getProjects = async (workspaceId: string, userId: string) => {
  if (!workspaceId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }
  const isMember = await db.member.findFirst({
    where: {
      userId,
      workspaceId,
    },
  });

  if (!isMember) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, errorResponse.PROJECT.ACCESS);
  }

  const projects = await db.project.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return projects;
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

  const hasAccess = await db.member.findFirst({
    where: {
      userId,
      workspaceId: project.workspaceId,
      OR: [{ role: UserRoles.ADMIN }, { userId: project.workspace.userId }],
    },
  });

  if (!hasAccess) {
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

export const getProjectById = async (projectId: string, userId: string) => {
  if (!projectId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }
  const project = await db.project.findFirst({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.PROJECT.INVALID);
  }

  const isMember = await db.member.findFirst({
    where: {
      userId,
      workspaceId: project.workspaceId,
    },
  });

  if (!isMember) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.MEMBER.NOT_WORKSPACE_MEMBER,
    );
  }

  return project;
};
