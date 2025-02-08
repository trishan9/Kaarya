import { StatusCodes } from "http-status-codes";

import { db } from "@/db";

import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";

import { CreateLogSchema, UpdateLogSchema } from "./log.validator";

export const createLog = async (
  projectId: string,
  userId: string,
  createLogDto: CreateLogSchema,
) => {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { workspace: true },
  });

  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Project not found");
  }

  const member = await db.member.findFirst({
    where: {
      userId,
      workspaceId: project.workspaceId,
    },
  });

  if (!member) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      errorResponse.WORKSPACE.UNAUTHORIZED,
    );
  }

  return db.log.create({
    data: {
      ...createLogDto,
      projectId,
      memberId: member.id,
    },
    include: {
      member: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const getProjectLogs = async (projectId: string, userId: string) => {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { workspace: true },
  });

  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Project not found");
  }

  const member = await db.member.findFirst({
    where: {
      userId,
      workspaceId: project.workspaceId,
    },
  });

  if (!member) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      errorResponse.WORKSPACE.UNAUTHORIZED,
    );
  }

  return db.log.findMany({
    where: {
      projectId,
    },
    include: {
      member: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
};

export const updateLog = async (
  logId: string,
  userId: string,
  updateLogDto: UpdateLogSchema,
) => {
  const log = await db.log.findUnique({
    where: { id: logId },
    include: {
      project: {
        include: {
          workspace: true,
        },
      },
    },
  });

  if (!log || log.isDeleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.LOG.NOT_FOUND);
  }

  const member = await db.member.findFirst({
    where: {
      userId,
      workspaceId: log.project.workspaceId,
      id: log.memberId,
    },
  });

  if (!member) {
    throw new ApiError(StatusCodes.FORBIDDEN, errorResponse.LOG.NO_PERMISSION);
  }

  return db.log.update({
    where: { id: logId },
    data: updateLogDto,
    include: {
      member: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const softDeleteLog = async (logId: string, userId: string) => {
  const log = await db.log.findUnique({
    where: { id: logId },
    include: {
      project: {
        include: {
          workspace: true,
        },
      },
    },
  });

  if (!log || log.isDeleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.LOG.NOT_FOUND);
  }

  const member = await db.member.findFirst({
    where: {
      userId,
      workspaceId: log.project.workspaceId,
      id: log.memberId,
    },
  });

  if (!member) {
    throw new ApiError(StatusCodes.FORBIDDEN, errorResponse.LOG.NO_PERMISSION);
  }

  return db.log.update({
    where: { id: logId },
    data: { isDeleted: true },
    include: {
      member: {
        include: {
          user: true,
        },
      },
    },
  });
};
