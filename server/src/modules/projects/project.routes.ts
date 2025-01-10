import { isAuthenticated } from "@/middlewares/isAuthenticated";
import upload from "@/utils/multer";
import { Router } from "express";
import * as projectsController from "./project.controller";

const projectsRouter = Router();

projectsRouter.post(
  "/",
  isAuthenticated,
  upload.single("image"),
  projectsController.createProjects,
);

projectsRouter.get("/", isAuthenticated, projectsController.getAllProjects);

export default projectsRouter;
