// tests/task/task.routes.test.ts
import express from "express";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import * as taskControllers from "@/modules/task/task.controller";
import { taskRouter } from "@/modules/task/task.routes";

jest.mock("@/modules/task/task.controller");

describe("Task Routes", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/v1/tasks", taskRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /", () => {
    it("should return tasks list", async () => {
      const fakeTasks = { total: 1, tasks: [{ id: "t1", name: "Test Task" }] };
      (taskControllers.getTasks as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          tasks: fakeTasks,
          message: "Tasks fetched",
        });
      });
  
      const res = await request(app).get("/api/v1/tasks?workspaceId=ws123");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        tasks: fakeTasks,
        message: "Tasks fetched",
      });
    });
  });

  describe("POST /", () => {
    it("should call createTask and return created task", async () => {
      const fakeTask = { id: "t1", name: "New Task" };
      (taskControllers.createTask as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          task: fakeTask,
          message: "Task created",
        });
      });
  
      const res = await request(app)
        .post("/api/v1/tasks")
        .send({ name: "New Task", status: "BACKLOG", dueDate: "2025-03-05", priority: "MEDIUM", projectId: "p123", assigneeId: "m123", workspaceId: "ws123" });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        task: fakeTask,
        message: "Task created",
      });
    });
  });

  describe("PATCH /:taskId", () => {
    it("should update task and return updated task", async () => {
      const updatedTask = { id: "t1", name: "Updated Task" };
      (taskControllers.updateTask as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          task: updatedTask,
          message: "Task updated",
        });
      });
  
      const res = await request(app)
        .patch("/api/v1/tasks/t1")
        .send({ name: "Updated Task", status: "IN_PROGRESS", dueDate: "2025-03-10", projectId: "p123", assigneeId: "m123", description: "Desc", priority: "HIGH", sprint: "sprint1", storyPoints: "5" });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        task: updatedTask,
        message: "Task updated",
      });
    });
  });

  describe("DELETE /:taskId", () => {
    it("should delete task and return deletion message", async () => {
      const fakeDeletedTask = { id: "t1", name: "Task Deleted" };
      (taskControllers.deleteTask as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          deletedTask: fakeDeletedTask,
          message: "Task deleted",
        });
      });
  
      const res = await request(app).delete("/api/v1/tasks/t1");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        deletedTask: fakeDeletedTask,
        message: "Task deleted",
      });
    });
  });

  describe("GET /:taskId", () => {
    it("should return task details", async () => {
      const fakeTask = { id: "t1", name: "Fetched Task" };
      (taskControllers.getTask as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          task: fakeTask,
          message: "Task fetched",
        });
      });
  
      const res = await request(app).get("/api/v1/tasks/t1");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        task: fakeTask,
        message: "Task fetched",
      });
    });
  });

  describe("POST /bulk-update", () => {
    it("should update multiple tasks and return them", async () => {
      const fakeTasks = [{ id: "t1", status: "COMPLETED", position: 2000 }];
      (taskControllers.bulkUpdateTasks as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          tasks: fakeTasks,
          message: "Tasks updated",
        });
      });
  
      const res = await request(app)
        .post("/api/v1/tasks/bulk-update")
        .send({ tasks: [{ id: "t1", status: "COMPLETED", position: 2000 }] });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        tasks: fakeTasks,
        message: "Tasks updated",
      });
    });
  });
});
