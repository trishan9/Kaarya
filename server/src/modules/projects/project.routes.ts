import { Router } from "express";

import upload from "@/utils/multer";
import * as projectsController from "./project.controller";
import { isAuthenticated } from "@/middlewares/isAuthenticated";

const projectsRouter = Router();

projectsRouter.post(
  "/",
  isAuthenticated,
  upload.single("image"),
  projectsController.createProjects,
);

projectsRouter.get("/", isAuthenticated, projectsController.getAllProjects);

projectsRouter.patch(
  "/:projectId",
  isAuthenticated,
  upload.single("image"),
  projectsController.updateProject,
);
export default projectsRouter;
