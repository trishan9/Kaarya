import { Router } from "express";

import upload from "@/utils/multer";

import * as workspaceController from "./workspace.controller";

const workspaceRouter = Router();

workspaceRouter.post(
  "/",
  upload.single("image"),
  workspaceController.createWorkspace,
);
workspaceRouter.get("/", workspaceController.getWorkspaces);
workspaceRouter.get("/:workspaceId", workspaceController.getWorkspaceById);
workspaceRouter.get(
  "/:workspaceId/info",
  workspaceController.getWorkspaceInfoById,
);
workspaceRouter.patch(
  "/:workspaceId",
  upload.single("image"),
  workspaceController.updateWorkspace,
);
workspaceRouter.delete("/:workspaceId", workspaceController.deleteWorkspace);
workspaceRouter.post(
  "/:workspaceId/join",
  workspaceController.inviteToWorkspace,
);
workspaceRouter.post(
  "/:workspaceId/reset-invite-code",
  workspaceController.resetWorkspaceLink,
);

export { workspaceRouter };
