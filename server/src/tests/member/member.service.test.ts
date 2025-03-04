// tests/member/member.service.test.ts
import { StatusCodes } from "http-status-codes";
import * as memberService from "@/modules/member/member.service";
import { ApiError } from "@/utils/apiError";
import { errorResponse } from "@/utils/errorMessage";
import { db } from "@/db";
import { UserRoles } from "@/modules/member/member.validator";

jest.mock("@/db", () => ({
  db: {
    member: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    workspace: {}, // if needed in the future
  },
}));

describe("Member Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("deleteMember", () => {
    it("should throw BAD_REQUEST if memberId or userId is missing", async () => {
      await expect(memberService.deleteMember("", "user123")).rejects.toThrow(ApiError);
      await expect(memberService.deleteMember("m123", "")).rejects.toThrow(ApiError);
    });

    it("should throw NOT_FOUND if member is not found", async () => {
      (db.member.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(memberService.deleteMember("m123", "user123")).rejects.toThrow(ApiError);
    });

    it("should throw LAST_MEMBER error if workspace has only one member", async () => {
      const memberToDelete = { id: "m123", workspaceId: "ws123", role: "MEMBER", userId: "u2", workspace: { userId: "u1" } };
      (db.member.findUnique as jest.Mock).mockResolvedValue(memberToDelete);
      (db.member.findMany as jest.Mock).mockResolvedValue([memberToDelete]); // only one member
      await expect(memberService.deleteMember("m123", "user123")).rejects.toThrow(ApiError);
    });

    it("should throw NOT_WORKSPACE_MEMBER if requesting member is not found", async () => {
      const memberToDelete = { id: "m123", workspaceId: "ws123", role: "MEMBER", userId: "u2", workspace: { userId: "u1" } };
      (db.member.findUnique as jest.Mock).mockResolvedValue(memberToDelete);
      (db.member.findMany as jest.Mock).mockResolvedValue([memberToDelete, { id: "m124", workspaceId: "ws123", userId: "u3", role: "MEMBER" }]);
      (db.member.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(memberService.deleteMember("m123", "user123")).rejects.toThrow(ApiError);
    });

    it("should throw ADMIN_ONLY error if requesting member is not ADMIN", async () => {
      const memberToDelete = { id: "m123", workspaceId: "ws123", role: "MEMBER", userId: "u2", workspace: { userId: "u1" } };
      (db.member.findUnique as jest.Mock).mockResolvedValue(memberToDelete);
      (db.member.findMany as jest.Mock).mockResolvedValue([
        memberToDelete,
        { id: "m124", workspaceId: "ws123", userId: "u3", role: "MEMBER" },
      ]);
      // Requesting member exists but is not ADMIN.
      (db.member.findFirst as jest.Mock).mockResolvedValue({ id: "m125", role: "MEMBER", workspaceId: "ws123" });
      await expect(memberService.deleteMember("m123", "user123")).rejects.toThrow(ApiError);
    });

    it("should successfully delete a member", async () => {
      const memberToDelete = { id: "m123", workspaceId: "ws123", role: "MEMBER", userId: "u2", workspace: { userId: "u1" } };
      (db.member.findUnique as jest.Mock).mockResolvedValue(memberToDelete);
      (db.member.findMany as jest.Mock).mockResolvedValue([
        memberToDelete,
        { id: "m124", workspaceId: "ws123", role: "MEMBER", userId: "u3" },
      ]);
      (db.member.findFirst as jest.Mock).mockResolvedValue({ id: "m125", role: UserRoles.ADMIN, workspaceId: "ws123" });
      (db.member.delete as jest.Mock).mockResolvedValue(memberToDelete);

      const result = await memberService.deleteMember("m123", "user123");
      expect(result).toEqual(memberToDelete);
    });
  });

  describe("updateRole", () => {
    it("should throw NOT_FOUND if userId is missing", async () => {
      await expect(memberService.updateRole("m123", UserRoles.ADMIN, "")).rejects.toThrow(ApiError);
    });

    it("should throw NOT_FOUND if target member is not found", async () => {
      (db.member.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(memberService.updateRole("m123", UserRoles.ADMIN, "user123")).rejects.toThrow(ApiError);
    });

    it("should throw CONFLICT if target member is trying to update self", async () => {
      const targetMember = { id: "m123", userId: "user123", role: "MEMBER", workspaceId: "ws123", workspace: { userId: "u1" } };
      (db.member.findUnique as jest.Mock).mockResolvedValue(targetMember);
      await expect(memberService.updateRole("m123", UserRoles.ADMIN, "user123")).rejects.toThrow(ApiError);
    });

    it("should update role successfully", async () => {
      // Target member is not self and not the workspace owner.
      const targetMember = { id: "m123", userId: "u2", role: "MEMBER", workspaceId: "ws123", workspace: { userId: "u1" } };
      (db.member.findUnique as jest.Mock).mockResolvedValue(targetMember);
      (db.member.findFirst as jest.Mock).mockResolvedValue({ id: "m125", role: UserRoles.ADMIN, workspaceId: "ws123" });
      const updatedMember = { id: "m123", role: UserRoles.ADMIN, user: { id: "u2", name: "Member", email: "member@example.com" } };
      (db.member.update as jest.Mock).mockResolvedValue(updatedMember);

      const result = await memberService.updateRole("m123", UserRoles.ADMIN, "user123");
      expect(result).toEqual(updatedMember);
    });
  });
});
