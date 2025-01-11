import { StatusCodes } from "http-status-codes";
import { db } from "@/db";
import { CreateMemberType, UserRoles } from "./member.validator";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";

export const create = async (memberData: CreateMemberType) => {
  return await db.member.create({
    data: memberData,
  });
};

export const deleteMember = async (memberId: string, userId: string) => {
  if (!memberId || !userId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const memberToDelete = await db.member.findUnique({
    where: { id: memberId },
    include: {
      workspace: true,
    },
  });

  if (!memberToDelete) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.MEMBER.INVALID);
  }

  const workspaceMembers = await db.member.findMany({
    where: {
      workspaceId: memberToDelete.workspaceId,
    },
    include: {
      user: true,
    },
  });

  if (workspaceMembers.length <= 1) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.MEMBER.LAST_MEMBER,
    );
  }

  const requestingMember = await db.member.findFirst({
    where: {
      userId: userId,
      workspaceId: memberToDelete.workspaceId,
    },
  });

  if (!requestingMember) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.MEMBER.NOT_WORKSPACE_MEMBER,
    );
  }

  if (requestingMember.role !== "ADMIN") {
    throw new ApiError(StatusCodes.FORBIDDEN, errorResponse.MEMBER.ADMIN_ONLY);
  }

  if (
    memberToDelete.role === "ADMIN" &&
    memberToDelete.userId !== memberToDelete.workspace.userId
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.MEMBER.ADMIN_DELETE_ADMIN,
    );
  }

  if (memberToDelete.userId === memberToDelete.workspace.userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.MEMBER.NO_PERMISSION,
    );
  }

  return await db.member.delete({
    where: { id: memberId },
  });
};

export const updateRole = async (
  memberId: string,
  role: UserRoles,
  userId: string,
) => {
  if (!userId) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.USER.NOT_FOUND);
  }

  const targetMember = await db.member.findUnique({
    where: { id: memberId },
    include: { workspace: true },
  });

  if (!targetMember) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.MEMBER.INVALID);
  }

  const requestingUser = await db.member.findFirst({
    where: {
      userId,
      workspaceId: targetMember.workspaceId,
    },
  });

  const isWorkspaceOwner = targetMember.workspace.userId === userId;

  if (targetMember.userId === userId) {
    throw new ApiError(StatusCodes.CONFLICT, errorResponse.MEMBER.SELF_UPDATE);
  }

  if (targetMember.workspace.userId === targetMember.userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.MEMBER.SUPER_ADMIN_UPDATE,
    );
  }

  if (
    !isWorkspaceOwner &&
    (!requestingUser || requestingUser.role !== UserRoles.ADMIN)
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.MEMBER.ADMIN_ONLY_ROLES,
    );
  }

  if (!isWorkspaceOwner && targetMember.role === UserRoles.ADMIN) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      errorResponse.MEMBER.ADMIN_UPDATE_ADMIN,
    );
  }

  return db.member.update({
    where: { id: memberId },
    data: { role },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};
