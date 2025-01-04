import { db } from "@/db";
import { CreateMemberType } from "./member.validator";
import { ApiError } from "@/utils/apiError";
import { StatusCodes } from "http-status-codes";
import { errorResponse } from "@/utils/errorMessage";

export const create = async (memberData: CreateMemberType) => {
  return await db.member.create({
    data: memberData,
  });
};

export const deleteMember = async (memberId: string, userId: string) => {

  const memberToDelete = await db.member.findUnique({
    where: { id: memberId },
    include: {
      workspace: true
    }
  });

  if (!memberToDelete) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.MEMBER.INVALID);
  }

  const workspaceMembers = await db.member.findMany({
    where: {
      workspaceId: memberToDelete.workspaceId
    },
    include: {
      user: true
    }
  });

  if (workspaceMembers.length <= 1) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.MEMBER.LAST_MEMBER
    );
  }

  const requestingMember = await db.member.findFirst({
    where: {
      userId: userId,
      workspaceId: memberToDelete.workspaceId
    }
  });

  if (!requestingMember) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.MEMBER.NOT_WORKSPACE_MEMBER
    );
  }

  if (requestingMember.role !== "ADMIN") {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.MEMBER.ADMIN_ONLY
    );
  }

  if (memberToDelete.role === "ADMIN" && memberToDelete.userId !== memberToDelete.workspace.userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.MEMBER.ADMIN_DELETE_ADMIN
    );
  }

  if (memberToDelete.userId === memberToDelete.workspace.userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      errorResponse.MEMBER.NO_PERMISSION
    );
  }

  const deletedMember = await db.member.delete({
    where: { id: memberId }
  });

  return deletedMember;
}
