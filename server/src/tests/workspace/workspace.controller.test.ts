// tests/workspace/workspace.controller.test.ts
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as workspaceService from "@/modules/workspace/workspace.service";
import * as memberService from "@/modules/member/member.service";
import { createWorkspace } from "@/modules/workspace/workspace.controller";
import { responseMessage } from "@/utils/responseMessage";
import { ApiError } from "@/utils/apiError";

// Mock apiResponse so it calls res.status() and res.json()
jest.mock("@/utils/apiResponse", () => ({
  apiResponse: (res: Response, status: number, data: any) => {
    res.status(status);
    return res.json(data);
  },
}));

jest.mock("@/modules/workspace/workspace.service");
jest.mock("@/modules/member/member.service");

describe("Workspace Controller - createWorkspace", () => {
  let req: Partial<Request> & { file?: Express.Multer.File };
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: { name: "Test Workspace" },
      file: { path: "image/path.jpg" } as Express.Multer.File,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { user: { id: "user123" } },
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create a workspace and add member, then return workspace", async () => {
    const fakeWorkspace = {
      id: "ws123",
      name: "Test Workspace",
      userId: "user123",
      inviteCode: "invite123",
    };
    (workspaceService.createWorkspace as jest.Mock).mockResolvedValue(fakeWorkspace);
    (memberService.create as jest.Mock).mockResolvedValue({ id: "member123" });

    await createWorkspace(req as Request, res as Response, next);

    // Verify that the controller calls the service with the correct payload.
    expect(workspaceService.createWorkspace).toHaveBeenCalledWith({
      name: "Test Workspace",
      userId: "user123",
      image: "image/path.jpg",
    });
    expect(memberService.create).toHaveBeenCalledWith({
      userId: "user123",
      workspaceId: fakeWorkspace.id,
      role: "ADMIN",
    });
  });
});
