// tests/member/member.controller.test.ts
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as memberService from "@/modules/member/member.service";
import { deleteMember, updateMemberRole } from "@/modules/member/member.controller";
import { responseMessage } from "@/utils/responseMessage";
import { ApiError } from "@/utils/apiError";

jest.mock("@/modules/member/member.service");

describe("Member Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { user: { id: "user123" } },
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("deleteMember", () => {
    it("should delete a member and return response", async () => {
      req.params = { memberId: "11111111-1111-1111-1111-111111111111" };
      const fakeMember = { id: "11111111-1111-1111-1111-111111111111", name: "Member Name" };
      (memberService.deleteMember as jest.Mock).mockResolvedValue(fakeMember);

      await deleteMember(req as Request, res as Response, next);

      expect(memberService.deleteMember).toHaveBeenCalledWith(
        "11111111-1111-1111-1111-111111111111",
        "user123"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        messsage: responseMessage.MEMBER.DELETED,
        member: fakeMember,
      });
    });
  });

  describe("updateMemberRole", () => {
    it("should update member role and return response", async () => {
      // Use a valid UUID for memberId.
      req.params = { memberId: "11111111-1111-1111-1111-111111111111" };
      req.body = { role: "ADMIN" };
      const updatedMember = {
        id: "11111111-1111-1111-1111-111111111111",
        role: "ADMIN",
        user: { id: "u1", name: "John", email: "john@example.com" },
      };
      (memberService.updateRole as jest.Mock).mockResolvedValue(updatedMember);

      await updateMemberRole(req as Request, res as Response, next);

      expect(memberService.updateRole).toHaveBeenCalledWith(
        "11111111-1111-1111-1111-111111111111",
        "ADMIN",
        "user123"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        member: updatedMember,
        messsage: responseMessage.MEMBER.ROLE_UPDATE,
      });
    });

    it("should pass error to next if validation fails", async () => {
      // Use an invalid memberId and role to trigger validation failure.
      req.params = { memberId: "invalid-member-id" };
      req.body = { role: "INVALID_ROLE" };

      await updateMemberRole(req as Request, res as Response, next);
      // Since asyncHandler catches errors and calls next, we expect next to be called with an error.
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });
});
