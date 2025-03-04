// tests/workspace/workspace.service.test.ts
import { StatusCodes } from "http-status-codes";
import * as workspaceService from "@/modules/workspace/workspace.service";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";
import { db } from "@/db";
import uploadToCloudinary from "@/lib/cloudinary";
import { streamClient } from "@/lib/stream";
import { generateInviteCode, INVITECODE_LENGTH } from "@/utils";

jest.mock("@/db", () => ({
  db: {
    workspace: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    member: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    task: {
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
    project: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/cloudinary", () => jest.fn());
jest.mock("@/lib/stream", () => ({
  streamClient: {
    channel: jest.fn().mockReturnValue({
      create: jest.fn().mockResolvedValue({}),
    }),
    upsertUser: jest.fn().mockResolvedValue({}),
    queryChannels: jest.fn().mockResolvedValue([]),
    createToken: jest.fn().mockReturnValue("streamToken123"),
  },
}));

jest.mock("@/utils", () => ({
  ...jest.requireActual("@/utils"),
  generateInviteCode: jest.fn().mockReturnValue("invite123"),
  INVITECODE_LENGTH: 6,
  capitalize: jest.fn((s: string) => s.charAt(0).toUpperCase() + s.slice(1)),
}));

describe("Workspace Service - createWorkspace", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw UNAUTHORIZED if no userId", async () => {
    // Provide image: null when no image is provided.
    await expect(
      workspaceService.createWorkspace({ name: "Test", userId: "", image: null })
    ).rejects.toThrow(ApiError);
  });

  it("should throw CONFLICT if workspace already exists", async () => {
    const input = { name: "New Workspace", userId: "user123", image: "localImagePath" };
    (db.workspace.findFirst as jest.Mock).mockResolvedValue({ id: "wsExisting" });
    await expect(workspaceService.createWorkspace(input)).rejects.toThrow(ApiError);
    expect(db.workspace.findFirst).toHaveBeenCalledWith({
      where: { name: input.name, userId: input.userId },
    });
  });

  it("should create workspace without image if image not provided", async () => {
    // When no image is provided, pass image: null.
    const inputNoImage = { name: "New Workspace", userId: "user123", image: null };
    const fakeWorkspace = {
      id: "ws123",
      name: inputNoImage.name,
      userId: inputNoImage.userId,
      inviteCode: "invite123",
    };
    (db.workspace.findFirst as jest.Mock).mockResolvedValue(null);
    (db.workspace.create as jest.Mock).mockResolvedValue(fakeWorkspace);
    const result = await workspaceService.createWorkspace(inputNoImage);
    expect(result).toEqual(fakeWorkspace);
  });

  it("should create workspace with image upload", async () => {
    const input = { name: "New Workspace", userId: "user123", image: "localImagePath" };
    (db.workspace.findFirst as jest.Mock).mockResolvedValue(null);
    (uploadToCloudinary as jest.Mock).mockResolvedValue({ secure_url: "cloudinaryUrl" });
    const fakeWorkspace = {
      id: "ws123",
      name: input.name,
      userId: input.userId,
      inviteCode: "invite123",
      imageUrl: "cloudinaryUrl",
    };
    (db.workspace.create as jest.Mock).mockResolvedValue(fakeWorkspace);
    const result = await workspaceService.createWorkspace(input);
    expect(uploadToCloudinary).toHaveBeenCalledWith("localImagePath");
    expect(result).toEqual(fakeWorkspace);
  });
});
