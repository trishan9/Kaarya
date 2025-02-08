import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AccessToken } from "livekit-server-sdk";

import { ApiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { errorResponse } from "@/utils/errorMessage";
import { responseMessage } from "@/utils/responseMessage";

export const getToken = asyncHandler(async (req: Request, res: Response) => {
  const { room }: { room: string } = req.query as { room: string };
  const user = res.locals?.user;

  if (!room || !user) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.VALIDATION.FAILED,
    );
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: user?.name,
  });

  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

  const token = await at.toJwt();

  return apiResponse(res, StatusCodes.OK, {
    token,
    message: responseMessage.LIVEKIT.TOKEN.CREATED,
  });
});
