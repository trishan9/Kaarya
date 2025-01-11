import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as memberService from "./member.service";
import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { responseMessage } from "@/utils/responseMessage";
import { updateRoleSchema } from "./member.validator";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";

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
        errorResponse.MEMBER.VALIDATION_FAILED
      );
    }

    const { memberId, role } = validatedParams.data;
    const updatedMember = await memberService.updateRole(memberId, role, userId)

    return apiResponse(res, StatusCodes.OK, {
      member: updatedMember,
      messsage: responseMessage.MEMBER.ROLE_UPDATE,
    });
  },
);
