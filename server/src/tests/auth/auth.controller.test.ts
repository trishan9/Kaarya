// tests/auth.controller.test.ts
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as authService from "@/modules/auth/auth.service"; // adjust the relative path if needed
import { register, login, logout } from "@/modules/auth/auth.controller";
import { responseMessage } from "@/utils/responseMessage";
import { ApiError } from "@/utils/apiError";

// --- Mock the service layer ---
jest.mock("@/modules/auth/auth.service");

describe("Auth Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      locals: {},
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should call authService.register and return 201 with new user", async () => {
      const newUser = { id: "user123", name: "John", email: "john@example.com" };
      req.body = { name: "John", email: "john@example.com", password: "pass123" };
      (authService.register as jest.Mock).mockResolvedValue(newUser);

      await register(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        data: newUser,
        message: responseMessage.USER.CREATED,
      });
    });
  });

  describe("login", () => {
    it("should call authService.login, set cookie, and return tokens", async () => {
      const tokens = {
        accessToken: "access123",
        refreshToken: "refresh123",
        streamToken: "stream123",
      };
      req.body = { email: "john@example.com", password: "pass123" };
      (authService.login as jest.Mock).mockResolvedValue(tokens);

      await login(req as Request, res as Response, next);

      expect(res.cookie).toHaveBeenCalledWith("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        accessToken: tokens.accessToken,
        streamToken: tokens.streamToken,
        message: responseMessage.USER.LOGGED_IN,
      });
    });
  });

  describe("logout", () => {
    it("should clear the refreshToken cookie and return a logged out message", async () => {
      await logout(req as Request, res as Response, next);

      expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessage.USER.LOGGED_OUT,
      });
    });
  });
});
