import { Router } from "express";
import { authRouter } from "./auth/auth.routes";
import { workspaceRouter } from "./workspace/workspace.routes";

const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/workspace", workspaceRouter)

export { rootRouter };
