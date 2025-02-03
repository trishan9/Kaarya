import { Router } from "express";

import * as logsController from "./log.controller";

const logRouter = Router();

logRouter.post("/projects/:projectId", logsController.createLogHandler);
logRouter.get("/projects/:projectId", logsController.getProjectLogsHandler);
logRouter.patch("/:logId", logsController.updateLogHandler);
logRouter.delete("/:logId", logsController.softDeleteLogHandler);

export { logRouter };
