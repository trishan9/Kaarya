import { Router } from "express";
import * as workspaceController from "./workspaces.controller";
import upload from "@/utils/multer";

const workspaceRouter = Router();

workspaceRouter.post(
  "/",
  upload.single("image"),
  workspaceController.createWorkspace,
);
workspaceRouter.get("/", workspaceController.getWorkspaces);
workspaceRouter.get("/:workspaceId", workspaceController.getWorkspaceById);
workspaceRouter.patch(
  "/:workspaceId",
  upload.single("image"),
  workspaceController.updateWorkspace,
);
workspaceRouter.delete("/:workspaceId", workspaceController.deleteWorkspace);

export { workspaceRouter };
