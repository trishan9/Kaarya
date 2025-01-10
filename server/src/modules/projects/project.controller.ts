import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";
import { createProjectSchema } from "./project.validator";
import { db } from "@/db";
import uploadToCloudinary from "@/lib/cloudinary";
import { UserRoles } from "../member/member.validator";

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

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        errorResponse.WORKSPACE.INVALID,
      );
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
      const cloudinaryResponse = await uploadToCloudinary(image);
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

    return apiResponse(res, StatusCodes.CREATED, {
      project: newProject,
      message: "Project created successfully",
    });
  },
);
