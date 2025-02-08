import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { responseMessage } from "@/utils/responseMessage";

import * as logServices from "./log.service";

export const createLogHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals?.user.id;
    const projectId = req.params.projectId;

    const log = await logServices.createLog(projectId, userId, req.body);

    return apiResponse(res, StatusCodes.CREATED, {
      log,
      message: responseMessage.LOG.CREATED,
    });
  },
);

export const getProjectLogsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals?.user.id;
    const projectId = req.params.projectId;

    const logs = await logServices.getProjectLogs(projectId, userId);

    return apiResponse(res, StatusCodes.OK, {
      logs,
      message: responseMessage.LOG.FETCHED,
    });
  },
);

export const updateLogHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals?.user.id;
    const logId = req.params.logId;

    const log = await logServices.updateLog(logId, userId, req.body);

    return apiResponse(res, StatusCodes.OK, {
      log,
      message: responseMessage.LOG.UPDATED,
    });
  },
);

export const softDeleteLogHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals?.user.id;
    const logId = req.params.logId;

    await logServices.softDeleteLog(logId, userId);

    return apiResponse(res, StatusCodes.OK, {
      message: responseMessage.LOG.DELETED,
    });
  },
);
