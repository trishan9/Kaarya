import { StatusCodes } from "http-status-codes";

import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";
import { db } from "@/db";
import { UpdateWorkspaceType } from "./workspace.validator";


// separate types schema as the userid will not be in the schema of the create it's later added from the auth 

interface CreateWorkspaceInput {
  userId: string;
  imageUrl?: string | null;
  name: string;
}

export const create = async (data: CreateWorkspaceInput) => {
  const newWorkspace = await db.workspace.create({
    data: {
      name: data.name,
      imageUrl: data.imageUrl,
      userId: data.userId
    }
  });

  return newWorkspace;
}

export const get = async (userId: string) => {
  // return all the workspaces that the current user is in
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
