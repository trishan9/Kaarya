import { Router } from "express";
import * as membersController from "./member.controller";
import { isAuthenticated } from "@/middlewares/isAuthenticated";

const memberRouter = Router();

memberRouter.delete(
  "/:memberId",
  isAuthenticated,
  membersController.deleteMember,
);

export { memberRouter };
