import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ApiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { responseMessage } from "@/utils/responseMessage";
import { errorResponse } from "@/utils/errorMessage";

import * as authService from "./auth.service";
import {
  loginUserSchema,
  loginUserType,
  registerUserSchema,
  registerUserType,
} from "./auth.validator";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;

  const result = registerUserSchema.safeParse(body);
  if (!result.success) {
    throw new ApiError(StatusCodes.FORBIDDEN, result.error.issues);
  }

  const { name, email, password } = body as registerUserType;

  const newUserObj = {
    name,
    email,
    password,
  };

  const newUser = await authService.register(newUserObj);

  return apiResponse(res, StatusCodes.CREATED, {
    data: newUser,
    message: responseMessage.USER.CREATED,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;

  const result = loginUserSchema.safeParse(body);
  if (!result.success) {
    throw new ApiError(StatusCodes.FORBIDDEN, result.error.issues);
  }

  const { email, password } = body as loginUserType;

  const { accessToken, refreshToken, streamToken } = await authService.login({
    email,
    password,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
  });

  return apiResponse(res, StatusCodes.OK, {
    accessToken,
    streamToken,
    message: responseMessage.USER.LOGGED_IN,
  });
});

export const getMe = asyncHandler(async (_: Request, res: Response) => {
  const user = await authService.getMe(res.locals.user.id);

  return apiResponse(res, StatusCodes.OK, {
    data: user,
    message: responseMessage.USER.RETRIEVED,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    throw new ApiError(StatusCodes.UNAUTHORIZED, errorResponse.TOKEN.EXPIRED);

  const { accessToken, streamToken } = await authService.refresh(refreshToken);

  return apiResponse(res, StatusCodes.OK, {
    accessToken,
    streamToken,
    message: responseMessage.USER.REFRESH,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return apiResponse(res, StatusCodes.OK, {
    message: responseMessage.USER.LOGGED_OUT,
  });
});
