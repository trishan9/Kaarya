import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "@/middlewares/globalErrorHandler";
import { apiRequestLogger } from "@/logging/logger";
import config from "./config";
import { rootRouter } from "./modules/root.router";

const app = express();

app.use(cors(config.cors));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(apiRequestLogger);

app.get("/health-check", (_, res) => {
  return res.json({
    message: "Kaarya server up and running!",
  });
});

app.use("/api/v1", rootRouter);

app.use(errorHandler);

export { app };
