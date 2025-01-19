import { Router } from "express";

import * as taskControllers from "./task.controller";

const taskRouter = Router();

taskRouter.get("/", taskControllers.getTasks);
taskRouter.post("/", taskControllers.createTask);

export { taskRouter };
