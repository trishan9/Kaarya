import { Router } from "express";
import { authRouter } from "./auth/auth.routes";

const rootRouter = Router();

rootRouter.use("/auth", authRouter);

export { rootRouter };
