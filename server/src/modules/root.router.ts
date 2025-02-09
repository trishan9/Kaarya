import { Router } from "express";

import { isAuthenticated } from "@/middlewares/isAuthenticated";

import { authRouter } from "./auth/auth.routes";
import { workspaceRouter } from "./workspace/workspace.routes";
import { memberRouter } from "./member/member.routes";
import { projectRouter } from "./project/project.routes";
import { taskRouter } from "./task/task.routes";
import { logRouter } from "./log/log.routes";
import { livekitRouter } from "./livekit/livekit.routes";

const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/workspaces", isAuthenticated, workspaceRouter);
rootRouter.use("/members", isAuthenticated, memberRouter);
rootRouter.use("/projects", isAuthenticated, projectRouter);
rootRouter.use("/tasks", isAuthenticated, taskRouter);
rootRouter.use("/logs", isAuthenticated, logRouter);
rootRouter.use("/livekit", isAuthenticated, livekitRouter);

export { rootRouter };
