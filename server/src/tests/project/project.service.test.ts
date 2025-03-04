// tests/project/project.service.test.ts
import { StatusCodes } from "http-status-codes";
import * as projectServices from "@/modules/project/project.service";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";
import { db } from "@/db";
import uploadToCloudinary from "@/lib/cloudinary";

// Update the mock to include the workspace property.
jest.mock("@/db", () => ({
  db: {
    project: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    workspace: {
      findUnique: jest.fn(), // <-- Added this mock
    },
    member: {
      findFirst: jest.fn(),
    },
    task: {
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/cloudinary", () => jest.fn());

describe("Project Service - create", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw UNAUTHORIZED if no userId", async () => {
    await expect(
      projectServices.create({
        name: "Test Project",
        workspaceId: "ws123",
        userId: "",
        image: null,
      })
    ).rejects.toThrow(ApiError);
  });

  it("should throw CONFLICT if project already exists", async () => {
    const input = {
      name: "Test Project",
      workspaceId: "ws123",
      userId: "user123",
      image: "localImagePath",
    };
    (db.project.findFirst as jest.Mock).mockResolvedValue({ id: "pExisting" });
    await expect(projectServices.create(input)).rejects.toThrow(ApiError);
    expect(db.project.findFirst).toHaveBeenCalledWith({
      where: { name: input.name, workspaceId: input.workspaceId },
    });
  });

  it("should throw NOT_FOUND if workspace does not exist", async () => {
    const input = {
      name: "Test Project",
      workspaceId: "ws123",
      userId: "user123",
      image: null,
    };
    (db.project.findFirst as jest.Mock).mockResolvedValue(null);
    (db.workspace.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(projectServices.create(input)).rejects.toThrow(ApiError);
  });

  it("should throw FORBIDDEN if user does not have access", async () => {
    const input = {
      name: "Test Project",
      workspaceId: "ws123",
      userId: "user123",
      image: null,
    };
    (db.project.findFirst as jest.Mock).mockResolvedValue(null);
    (db.workspace.findUnique as jest.Mock).mockResolvedValue({ id: "ws123", userId: "otherUser" });
    (db.member.findFirst as jest.Mock).mockResolvedValue(null);
    await expect(projectServices.create(input)).rejects.toThrow(ApiError);
  });

  it("should create a project without image if image is not provided", async () => {
    const input = {
      name: "Test Project",
      workspaceId: "ws123",
      userId: "user123",
      image: null,
    };
    const fakeProject = { id: "p123", name: "Test Project", workspaceId: "ws123" };
    (db.project.findFirst as jest.Mock).mockResolvedValue(null);
    (db.workspace.findUnique as jest.Mock).mockResolvedValue({ id: "ws123", userId: "user123" });
    (db.member.findFirst as jest.Mock).mockResolvedValue({ id: "member1" });
    (db.project.create as jest.Mock).mockResolvedValue(fakeProject);
    const result = await projectServices.create(input);
    expect(result).toEqual(fakeProject);
  });

  it("should create a project with image upload if image is provided", async () => {
    const input = {
      name: "Test Project",
      workspaceId: "ws123",
      userId: "user123",
      image: "localImagePath",
    };
    const fakeProject = {
      id: "p123",
      name: "Test Project",
      workspaceId: "ws123",
      imageUrl: "cloudinaryUrl",
    };
    (db.project.findFirst as jest.Mock).mockResolvedValue(null);
    (db.workspace.findUnique as jest.Mock).mockResolvedValue({ id: "ws123", userId: "user123" });
    (db.member.findFirst as jest.Mock).mockResolvedValue({ id: "member1" });
    (uploadToCloudinary as jest.Mock).mockResolvedValue({ secure_url: "cloudinaryUrl" });
    (db.project.create as jest.Mock).mockResolvedValue(fakeProject);
    const result = await projectServices.create(input);
    expect(uploadToCloudinary).toHaveBeenCalledWith("localImagePath");
    expect(result).toEqual(fakeProject);
  });
});
