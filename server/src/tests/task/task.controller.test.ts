// tests/task/task.controller.test.ts
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as taskServices from "@/modules/task/task.service";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  getTask,
  bulkUpdateTasks,
} from "@/modules/task/task.controller";
import { responseMessage } from "@/utils/responseMessage";
import { ApiError } from "@/utils/apiError";

// Mock the task service
jest.mock("@/modules/task/task.service");

describe("Task Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  
  beforeEach(() => {
    req = { query: {}, body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { user: { id: "user123" } },
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should return tasks when query is valid", async () => {
      req.query = { workspaceId: "ws123", search: "test" };
      const fakeResult = { total: 1, tasks: [{ id: "t1", name: "Test Task" }] };
      (taskServices.getTasks as jest.Mock).mockResolvedValue(fakeResult);
  
      await getTasks(req as Request, res as Response, next);
  
      expect(taskServices.getTasks).toHaveBeenCalledWith(
        { workspaceId: "ws123", search: "test" },
        "user123"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        tasks: fakeResult,
        message: responseMessage.TASK.FETCHED,
      });
    });
  });

  describe("createTask", () => {
    it("should create a task and return it", async () => {
      req.body = {
        name: "New Task",
        status: "BACKLOG",
        dueDate: "2025-03-05",
        priority: "MEDIUM",
        projectId: "p123",
        assigneeId: "m123",
        workspaceId: "ws123",
      };
      const fakeTask = { id: "t1", name: "New Task" };
      (taskServices.create as jest.Mock).mockResolvedValue(fakeTask);
  
      await createTask(req as Request, res as Response, next);
  
      // Expect the service to be called with dueDate as a Date and other properties intact.
      expect(taskServices.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New Task",
          status: "BACKLOG",
          dueDate: new Date("2025-03-05"),
          priority: "MEDIUM",
          projectId: "p123",
          assigneeId: "m123",
          workspaceId: "ws123",
        }),
        "user123"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        task: fakeTask,
        message: responseMessage.TASK.CREATED,
      });
    });
  });

  describe("deleteTask", () => {
    it("should delete a task and return deleted task", async () => {
      req.params = { taskId: "t1" };
      const fakeDeletedTask = { id: "t1", name: "Task to Delete" };
      (taskServices.deleteTask as jest.Mock).mockResolvedValue(fakeDeletedTask);
  
      await deleteTask(req as Request, res as Response, next);
  
      expect(taskServices.deleteTask).toHaveBeenCalledWith("t1", "user123");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        deletedTask: fakeDeletedTask,
        message: responseMessage.TASK.DELETED,
      });
    });
  });

  describe("updateTask", () => {
    it("should update a task and return updated task", async () => {
      req.params = { taskId: "t1" };
      req.body = {
        name: "Updated Task",
        status: "IN_PROGRESS",
        dueDate: "2025-03-10",
        projectId: "p123",
        assigneeId: "m123",
        description: "Desc",
        priority: "HIGH",
        sprint: "sprint1",
        storyPoints: 5, // Number value
      };
      const fakeUpdatedTask = { id: "t1", name: "Updated Task" };
      (taskServices.updateTask as jest.Mock).mockResolvedValue(fakeUpdatedTask);
    });
  });

  describe("getTask", () => {
    it("should return a task by id", async () => {
      req.params = { taskId: "t1" };
      const fakeTask = { id: "t1", name: "Fetched Task" };
      (taskServices.getTask as jest.Mock).mockResolvedValue(fakeTask);
  
      await getTask(req as Request, res as Response, next);
  
      expect(taskServices.getTask).toHaveBeenCalledWith("t1", "user123");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        task: fakeTask,
        message: responseMessage.TASK.FETCHED,
      });
    });
  });

  describe("bulkUpdateTasks", () => {
    it("should update multiple tasks and return them", async () => {
      req.body = { tasks: [{ id: "t1", status: "COMPLETED", position: 2000 }] };
      const fakeTasks = [{ id: "t1", status: "COMPLETED", position: 2000 }];
      (taskServices.bulkUpdateTasks as jest.Mock).mockResolvedValue(fakeTasks);
  
      await bulkUpdateTasks(req as Request, res as Response, next);
  
      expect(taskServices.bulkUpdateTasks).toHaveBeenCalledWith(
        [{ id: "t1", status: "COMPLETED", position: 2000 }],
        "user123"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        tasks: fakeTasks,
        message: responseMessage.TASK.UPDATED,
      });
    });
  });
});
