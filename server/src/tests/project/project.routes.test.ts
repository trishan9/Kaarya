// tests/project/project.routes.test.ts
import express from "express";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import * as projectControllers from "@/modules/project/project.controller";
import { projectRouter } from "@/modules/project/project.routes";

// Override isAuthenticated middleware to inject a dummy user.
jest.mock("@/middlewares/isAuthenticated", () => ({
  isAuthenticated: (req, res, next) => {
    res.locals.user = { id: "user123" };
    next();
  },
}));

// Mock the controller functions.
jest.mock("@/modules/project/project.controller");

describe("Project Routes", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/v1/projects", projectRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /", () => {
    it("should call createProject and return created project", async () => {
      const fakeProject = { id: "p123", name: "Test Project" };
      (projectControllers.createProject as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.CREATED).json({
          project: fakeProject,
          message: "Project created",
        });
      });

      const res = await request(app)
        .post("/api/v1/projects")
        .field("name", "Test Project")
        .field("workspaceId", "ws123")
        .attach("image", Buffer.from("fake image"), "image.jpg");

      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body).toEqual({
        project: fakeProject,
        message: "Project created",
      });
    });
  });

  describe("PATCH /:projectId", () => {
    it("should call updateProject and return updated project", async () => {
      const updatedProject = { id: "p123", name: "Updated Project" };
      (projectControllers.updateProject as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          project: updatedProject,
          message: "Project updated",
        });
      });

      const res = await request(app)
        .patch("/api/v1/projects/p123")
        .field("name", "Updated Project")
        .attach("image", Buffer.from("new fake image"), "image.jpg");

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        project: updatedProject,
        message: "Project updated",
      });
    });
  });

  describe("DELETE /:projectId", () => {
    it("should call deleteProject and return deletion message", async () => {
      (projectControllers.deleteProject as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          deletedProject: { id: "p123", name: "Test Project" },
          message: "Project deleted",
        });
      });

      const res = await request(app).delete("/api/v1/projects/p123");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        deletedProject: { id: "p123", name: "Test Project" },
        message: "Project deleted",
      });
    });
  });

  describe("GET /", () => {
    it("should call getAllProjects and return projects list", async () => {
      const fakeProjects = [{ id: "p123", name: "Test Project" }];
      (projectControllers.getAllProjects as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          projects: fakeProjects,
          message: "Projects retrieved",
        });
      });

      const res = await request(app).get("/api/v1/projects?workspaceId=ws123");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        projects: fakeProjects,
        message: "Projects retrieved",
      });
    });
  });

  describe("GET /:projectId", () => {
    it("should call getProjectById and return project details", async () => {
      const fakeProject = { id: "p123", name: "Test Project" };
      (projectControllers.getProjectById as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          project: fakeProject,
          message: "Project retrieved",
        });
      });

      const res = await request(app).get("/api/v1/projects/p123");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        project: fakeProject,
        message: "Project retrieved",
      });
    });
  });

  describe("GET /:projectId/analytics", () => {
    it("should call getProjectAnalyticsById and return analytics data", async () => {
      const analyticsData = { someAnalytics: "data" };
      (projectControllers.getProjectAnalyticsById as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          ...analyticsData,
          message: "Project retrieved",
        });
      });

      const res = await request(app).get("/api/v1/projects/p123/analytics");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        ...analyticsData,
        message: "Project retrieved",
      });
    });
  });
});
