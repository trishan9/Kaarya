import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as memberService from "./member.service";
import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { responseMessage } from "@/utils/responseMessage";

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
