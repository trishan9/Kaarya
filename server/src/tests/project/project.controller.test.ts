// tests/project/project.controller.test.ts
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as projectServices from "@/modules/project/project.service";
import {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  getProjectById,
  getProjectAnalyticsById,
} from "@/modules/project/project.controller";
import { responseMessage } from "@/utils/responseMessage";
import { ApiError } from "@/utils/apiError";

// Mock the project service functions.
jest.mock("@/modules/project/project.service");

describe("Project Controller", () => {
  let req: Partial<Request> & { file?: Express.Multer.File };
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { user: { id: "user123" } },
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("createProject", () => {
    it("should create a project and return 201", async () => {
      req.body = { name: "Test Project", workspaceId: "ws123" };
      // Simulate file upload
      req.file = { path: "image/path.jpg" } as Express.Multer.File;
      const fakeProject = { id: "p123", name: "Test Project", workspaceId: "ws123", userId: "user123" };
      (projectServices.create as jest.Mock).mockResolvedValue(fakeProject);

      await createProject(req as Request, res as Response, next);

      expect(projectServices.create).toHaveBeenCalledWith({
        name: "Test Project",
        workspaceId: "ws123",
        userId: "user123",
        image: "image/path.jpg",
      });
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        project: fakeProject,
        message: responseMessage.PROJECT.CREATED,
      });
    });
  });

  describe("getAllProjects", () => {
    it("should return projects list", async () => {
      req.query = { workspaceId: "ws123" };
      const fakeProjects = [{ id: "p123", name: "Test Project" }];
      (projectServices.getProjects as jest.Mock).mockResolvedValue(fakeProjects);

      await getAllProjects(req as Request, res as Response, next);

      expect(projectServices.getProjects).toHaveBeenCalledWith("ws123", "user123");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        projects: fakeProjects,
        message: responseMessage.PROJECT.RETRIEVED,
      });
    });
  });

  describe("updateProject", () => {
    it("should update project and return updated project", async () => {
      req.params = { projectId: "p123" };
      req.body = { name: "Updated Project" };
      req.file = { path: "new/image/path.jpg" } as Express.Multer.File;
      const updatedProject = { id: "p123", name: "Updated Project" };
      (projectServices.updateProject as jest.Mock).mockResolvedValue(updatedProject);

      await updateProject(req as Request, res as Response, next);

      expect(projectServices.updateProject).toHaveBeenCalledWith(
        "p123",
        "user123",
        { name: "Updated Project", image: "new/image/path.jpg" }
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        project: updatedProject,
        message: responseMessage.PROJECT.UPDATED,
      });
    });
  });

  describe("deleteProject", () => {
    it("should delete project and return deleted project message", async () => {
      req.params = { projectId: "p123" };
      const deletedProject = { id: "p123", name: "Test Project" };
      (projectServices.deleteProject as jest.Mock).mockResolvedValue(deletedProject);

      await deleteProject(req as Request, res as Response, next);

      expect(projectServices.deleteProject).toHaveBeenCalledWith("p123", "user123");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        deletedProject,
        message: responseMessage.PROJECT.DELETED,
      });
    });
  });

  describe("getProjectById", () => {
    it("should return project details", async () => {
      req.params = { projectId: "p123" };
      const fakeProject = { id: "p123", name: "Test Project" };
      (projectServices.getProjectById as jest.Mock).mockResolvedValue(fakeProject);

      await getProjectById(req as Request, res as Response, next);

      expect(projectServices.getProjectById).toHaveBeenCalledWith("p123", "user123");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        project: fakeProject,
        message: responseMessage.PROJECT.RETRIEVED,
      });
    });
  });

  describe("getProjectAnalyticsById", () => {
    it("should return project analytics", async () => {
      req.params = { projectId: "p123" };
      const analyticsData = { someAnalytics: "data" };
      (projectServices.getProjectAnalyticsById as jest.Mock).mockResolvedValue(analyticsData);

      await getProjectAnalyticsById(req as Request, res as Response, next);

      expect(projectServices.getProjectAnalyticsById).toHaveBeenCalledWith("p123", "user123");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        ...analyticsData,
        message: responseMessage.PROJECT.RETRIEVED,
      });
    });
  });
});
