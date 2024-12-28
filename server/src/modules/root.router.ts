import { Router } from "express";
import { authRouter } from "./auth/auth.routes";
import { workspaceRouter } from "./workspaces/workspaces.routes";
import { isAuthenticated } from "@/middlewares/isAuthenticated";

const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/workspaces", isAuthenticated, workspaceRouter);

export { rootRouter };
