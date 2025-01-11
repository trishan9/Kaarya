import { Router } from "express";
import { authRouter } from "./auth/auth.routes";
import { workspaceRouter } from "./workspace/workspace.routes";
import { isAuthenticated } from "@/middlewares/isAuthenticated";
import { memberRouter } from "./member/member.routes";
import { projectRouter } from "./project/project.routes";
import { taskRouter } from "./task/task.routes";

const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/workspaces", isAuthenticated, workspaceRouter);
rootRouter.use("/members", memberRouter);
rootRouter.use("/projects", projectRouter);
rootRouter.use("/tasks", taskRouter);

export { rootRouter };
