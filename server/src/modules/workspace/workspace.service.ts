import { StatusCodes } from "http-status-codes";

import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";
import { db } from "@/db";
import { CreateWorkspaceType, UpdateWorkspaceType } from "./workspace.validator";


export const create = async (data: CreateWorkspaceType) => {
  const newWorkspace = await db.workspace.create({
    data: {
      name: data.name,
      imageUrl: data.image?.toString(),
      userId: data.userId
    }
  });

  console.log(newWorkspace)
  return newWorkspace;

}

export const get = async (userId: string) => {
  const workspace = await db.workspace.findMany({
    where: {
      Members: {
        some: {
          userId: userId
        }
      }
    }
  });
  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, errorResponse.WORKSPACE.INVALID);
  }
  return workspace;
}

export const update = async (data: UpdateWorkspaceType) => { }
