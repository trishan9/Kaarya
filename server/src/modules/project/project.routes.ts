import { Router } from "express";

import upload from "@/utils/multer";
import * as projectsController from "./project.controller";
import { isAuthenticated } from "@/middlewares/isAuthenticated";

const projectRouter = Router();

projectRouter.post(
  "/",
  isAuthenticated,
  upload.single("image"),
  projectsController.createProject,
);
projectRouter.patch(
  "/:projectId",
  isAuthenticated,
  upload.single("image"),
  projectsController.updateProject,
);
projectRouter.delete(
  "/:projectId",
  isAuthenticated,
  projectsController.deleteProject,
);
projectRouter.get("/", isAuthenticated, projectsController.getAllProjects);
projectRouter.get(
  "/:projectId",
  isAuthenticated,
  projectsController.getProjectById,
);

export default projectRouter;
