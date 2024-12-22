import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";
import hash from "@/lib/hash";
import { loginUserType } from "./auth.validator";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/modules/token/token.services";
import token from "@/lib/token";
import { logger } from "@/logging/logger";
import { db } from "@/db";

export const registerAdmin = async (data: Prisma.AdminCreateInput) => {
  const exists = await db.admin.findFirst({
    where: {
      OR: [{ username: data.username }, { email: data.email }],
    },
  });

  if (exists) {
    if (exists.username === data.username) {
      throw new ApiError(StatusCodes.CONFLICT, errorResponse.USERNAME.CONFLICT);
    }

    if (exists.email === data.email) {
      throw new ApiError(StatusCodes.CONFLICT, errorResponse.EMAIL.CONFLICT);
    }
  }

  const hashedPassword = await hash.generate(data.password);

  return await db.admin.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

export const login = async (data: loginUserType) => {
  const user = await db.admin.findUnique({
    where: {
      username: data.username,
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
  const user = await db.admin.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, errorResponse.USER.NOT_FOUND);
  }

  const { id, name, username, email, role, isOAuth } = user;
  return {
    id,
    name,
    username,
    email,
    role,
    isOAuth,
  };
};

export const refresh = async (refreshToken: string) => {
  const decoded = token.verify({ token: refreshToken, tokenType: "refresh" });

  let user: any;
  if (decoded) {
    user = await db.admin.findUnique({ where: { id: decoded.id } });
  }
  if (!user)
    throw new ApiError(StatusCodes.UNAUTHORIZED, errorResponse.TOKEN.EXPIRED);

  logger.info(user.username);

  const accessToken = generateAccessToken(user);
  return accessToken;
};
