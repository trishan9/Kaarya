import { StatusCodes } from "http-status-codes";

import { db } from "@/db";
import { ApiError } from "@/utils/apiError";
import uploadToCloudinary from "@/lib/cloudinary";
import { errorResponse } from "@/utils/errorMessage";
import { CreateProjectInput } from "./project.validator";
import { UserRoles } from "../member/member.validator";

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

export const getProjects = async () => {
  return await db.project.findMany();
};

// update projects services
export const updateProjects = async () => {};
