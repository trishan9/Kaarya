import { Router } from "express";
import * as workspaceController from "./workspace.controller"

import { isAuthenticated } from "@/middlewares/isAuthenticated";
import upload from "@/utils/multer";

const workspaceRouter = Router();

workspaceRouter.post("/create", isAuthenticated, upload.single("file"), workspaceController.createWorkspace)
workspaceRouter.get('/', isAuthenticated, workspaceController.getWorkspace)
workspaceRouter.patch("/", isAuthenticated, workspaceController.updateWorkspace)

export { workspaceRouter }
