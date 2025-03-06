import { Router } from "express";

import { isAuthenticated } from "@/middlewares/isAuthenticated";

import * as authController from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", isAuthenticated, authController.getMe);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.post("/supabase", authController.supabaseAuth);

export { authRouter };
