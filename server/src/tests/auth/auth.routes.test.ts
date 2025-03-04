// tests/auth.routes.test.ts
import express from "express";
import request from "supertest";
import { StatusCodes } from "http-status-codes";

// Override isAuthenticated middleware for testing
jest.mock("@/middlewares/isAuthenticated", () => ({
  isAuthenticated: (req, res, next) => {
    res.locals.user = { id: "dummy-user" };
    next();
  },
}));

// Mock the authController functions to simulate behavior
import * as authController from "@/modules/auth/auth.controller";
jest.mock("@/modules/auth/auth.controller");

import { authRouter } from "@/modules/auth/auth.routes";

describe("Auth Routes", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/v1/auth", authRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should call authController.register and return expected response", async () => {
      const fakeUser = { id: "user123", name: "Test", email: "test@example.com" };
      (authController.register as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.CREATED).json({
          data: fakeUser,
          message: "User created",
        });
      });

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "Test", email: "test@example.com", password: "pass123" });

      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body).toEqual({
        data: fakeUser,
        message: "User created",
      });
    });
  });

  describe("POST /login", () => {
    it("should call authController.login and return tokens", async () => {
      const tokens = { accessToken: "access123", streamToken: "stream123" };
      (authController.login as jest.Mock).mockImplementation((req, res, next) => {
        res.cookie("refreshToken", "refresh123", {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
        });
        return res.status(StatusCodes.OK).json({
          accessToken: tokens.accessToken,
          streamToken: tokens.streamToken,
          message: "User logged in",
        });
      });

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "test@example.com", password: "pass123" });

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        accessToken: tokens.accessToken,
        streamToken: tokens.streamToken,
        message: "User logged in",
      });
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("GET /me", () => {
    it("should return user data", async () => {
      const userData = { id: "dummy-user", name: "Test", email: "test@example.com" };
      (authController.getMe as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          data: userData,
          message: "User retrieved",
        });
      });

      const res = await request(app).get("/api/v1/auth/me");

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        data: userData,
        message: "User retrieved",
      });
    });
  });

  describe("POST /refresh", () => {
    it("should call authController.refresh and return new tokens", async () => {
      const tokens = { accessToken: "access123", streamToken: "stream123" };
      (authController.refresh as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          accessToken: tokens.accessToken,
          streamToken: tokens.streamToken,
          message: "Token refreshed",
        });
      });

      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", ["refreshToken=refresh123"]);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        accessToken: tokens.accessToken,
        streamToken: tokens.streamToken,
        message: "Token refreshed",
      });
    });
  });

  describe("POST /logout", () => {
    it("should call authController.logout and return logged out message", async () => {
      (authController.logout as jest.Mock).mockImplementation((req, res, next) => {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });
        return res.status(StatusCodes.OK).json({
          message: "User logged out",
        });
      });

      const res = await request(app).post("/api/v1/auth/logout");

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        message: "User logged out",
      });
    });
  });
});
