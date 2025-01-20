import { Router } from "express";

import * as taskControllers from "./task.controller";

const taskRouter = Router();

taskRouter.get("/", taskControllers.getTasks);
taskRouter.post("/", taskControllers.createTask);
taskRouter.patch("/:taskId", taskControllers.updateTask);
taskRouter.delete("/:taskId", taskControllers.deleteTask);
taskRouter.get("/:taskId", taskControllers.getTask);
taskRouter.post("/bulk-update", taskControllers.bulkUpdateTasks);

export { taskRouter };
