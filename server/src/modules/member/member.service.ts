import { db } from "@/db";
import { CreateMemberType } from "./member.validator";
import { ApiError } from "@/utils/apiError";
import { StatusCodes } from "http-status-codes";

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
    throw new ApiError(StatusCodes.NOT_FOUND, "Member not found");
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
      "Cannot delete the last member of a workspace"
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
      "You are not a member of this workspace"
    );
  }

  if (requestingMember.role !== "ADMIN") {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "Only admins can delete members"
    );
  }

  if (memberToDelete.role === "ADMIN" && memberToDelete.userId !== memberToDelete.workspace.userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "Admins cannot delete other admins"
    );
  }

  if (memberToDelete.userId === memberToDelete.workspace.userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "Cannot delete the workspace creator"
    );
  }

  const deletedMember = await db.member.delete({
    where: { id: memberId }
  });

  return deletedMember;
}
