import { Router } from "express";

import { isAuthenticated } from "@/middlewares/isAuthenticated";

import * as logsController from "./log.controller";

const logRouter = Router();

logRouter.post(
  "/projects/:projectId",
  isAuthenticated,
  logsController.createLogHandler,
);
logRouter.get(
  "/projects/:projectId",
  isAuthenticated,
  logsController.getProjectLogsHandler,
);
logRouter.patch("/:logId", isAuthenticated, logsController.updateLogHandler);
logRouter.delete(
  "/:logId",
  isAuthenticated,
  logsController.softDeleteLogHandler,
);

export { logRouter };
