import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

import { db } from "@/db";

import { logger } from "@/logging/logger";

import token from "@/lib/token";
import hash from "@/lib/hash";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";

import { loginUserType } from "./auth.validator";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/modules/token/token.service";
import { sendOnboardingMail } from "../mail/mail.service";

export const register = async (data: Prisma.UserCreateInput) => {
  const exists = await db.user.findFirst({
    where: { email: data.email },
  });

  if (exists) {
    throw new ApiError(StatusCodes.CONFLICT, errorResponse.EMAIL.CONFLICT);
  }

  const hashedPassword = await hash.generate(data.password);

  const newUser = await db.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  await sendOnboardingMail(data);

  return newUser;
};

export const login = async (data: loginUserType) => {
  const user = await db.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, errorResponse.USER.NOT_FOUND);
  }

  const isPasswordValid = await hash.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorResponse.USER.INVALID_CREDENTIALS,
    );
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
  };
};

export const getMe = async (userId: string) => {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, errorResponse.USER.NOT_FOUND);
  }

  const { id, name, email } = user;
  return {
    id,
    name,
    email,
  };
};

export const refresh = async (refreshToken: string) => {
  const decoded = token.verify({ token: refreshToken, tokenType: "refresh" });

  let user: any;
  if (decoded) {
    user = await db.user.findUnique({ where: { id: decoded.id } });
  }
  if (!user)
    throw new ApiError(StatusCodes.UNAUTHORIZED, errorResponse.TOKEN.EXPIRED);

  logger.info(user.username);

  const accessToken = generateAccessToken(user);
  return accessToken;
};
