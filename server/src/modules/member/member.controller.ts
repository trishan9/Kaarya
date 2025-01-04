import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as memberService from "./member.service"
import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { db } from "@/db";
import { ApiError } from "@/utils/apiError";
import { responseMessage } from "@/utils/responseMessage";

export const deleteMember = asyncHandler(async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const userId = res.locals?.user?.id;

  const memberToDelete = await memberService.deleteMember(memberId, userId)
  return apiResponse(res, StatusCodes.OK, {
    messsage: responseMessage.MEMBER.DELETED,
    member: memberToDelete
  })
})

//for testing and development purpose
export const getAllMember = asyncHandler(async (req, res) => {
  const members = await db.member.findMany({
    include: { user: true, workspace: true },
  });
  if (!members) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Members not Found.")
  }
  return apiResponse(res, StatusCodes.OK, { message: "All members retrived successfully.", members })
})
