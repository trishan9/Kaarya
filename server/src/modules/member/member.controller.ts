import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as memberService from "./member.service";
import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { responseMessage } from "@/utils/responseMessage";
import { updateRoleSchema, UserRoles } from "./member.validator";
import { ApiError } from "@/utils/apiError";
import { db } from "@/db";

export const deleteMember = asyncHandler(
  async (req: Request, res: Response) => {
    const { memberId } = req.params;
    const userId = res.locals?.user?.id;

    const memberToDelete = await memberService.deleteMember(memberId, userId);

    return apiResponse(res, StatusCodes.OK, {
      messsage: responseMessage.MEMBER.DELETED,
      member: memberToDelete,
    });
  },
);


export const updateMemberRole = asyncHandler(

  async (req: Request, res: Response) => {
    const userId = res.locals?.user?.id;

    const validatedParams = updateRoleSchema.safeParse({
      memberId: req.params.memberId,
      role: req.body.role
    });

    if (!validatedParams.success) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Validation failed for update member role"
      );
    }

    const { memberId, role } = validatedParams.data;

    const targetMember = await db.member.findUnique({
      where: { id: memberId },
      include: { workspace: true }
    });

    if (!targetMember) {
      throw new ApiError(StatusCodes.NOT_FOUND, "member not found")
    }

    const isAdmin = await db.member.findFirst({
      where: {
        userId,
        workspaceId: targetMember.workspaceId,
        role: UserRoles.ADMIN
      }
    })

    if (!isAdmin) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "Only workspace admins can update member roles"
      );
    }

    const updatedMember = await db.member.update({
      where: {
        id: memberId
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return apiResponse(res, StatusCodes.OK, {
      member: updatedMember,
      messsage: "member role updated successfully",
    });
  },
);


