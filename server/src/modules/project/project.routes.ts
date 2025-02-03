import { Router } from "express";

import { isAuthenticated } from "@/middlewares/isAuthenticated";
import upload from "@/utils/multer";

import * as projectControllers from "./project.controller";

const projectRouter = Router();

projectRouter.post(
  "/",
  upload.single("image"),
  projectControllers.createProject,
);
projectRouter.patch(
  "/:projectId",
  upload.single("image"),
  projectControllers.updateProject,
);
projectRouter.delete("/:projectId", projectControllers.deleteProject);
projectRouter.get("/", isAuthenticated, projectControllers.getAllProjects);
projectRouter.get("/:projectId", projectControllers.getProjectById);
projectRouter.get(
  "/:projectId/analytics",
  projectControllers.getProjectAnalyticsById,
);

export { projectRouter };
