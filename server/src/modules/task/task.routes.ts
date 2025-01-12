import { Router } from "express";

import * as taskControllers from "./task.controller";

const taskRouter = Router();

taskRouter.post("/", taskControllers.createTask);

export { taskRouter };
