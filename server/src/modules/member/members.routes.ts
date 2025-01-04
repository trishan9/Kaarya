import { Router } from "express";
import * as  memberController from "./member.controller"
import { isAuthenticated } from "@/middlewares/isAuthenticated";

const memberRouter = Router();


memberRouter.delete("/:memberId", isAuthenticated, memberController.deleteMember);
memberRouter.get("/", memberController.getAllMember);

export { memberRouter }
