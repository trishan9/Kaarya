import { Router } from "express";

import * as authController from "./auth.controller";
import { isAuthenticated } from "@/middlewares/isAuthenticated";

const authRouter = Router();

authRouter.post("/register", authController.registerAdmin);
authRouter.post("/login", authController.login);
authRouter.get("/me", isAuthenticated, authController.getMe);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);

export { authRouter };
