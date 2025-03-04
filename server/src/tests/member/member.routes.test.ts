// tests/member/member.routes.test.ts
import express from "express";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import * as membersController from "@/modules/member/member.controller";
import { memberRouter } from "@/modules/member/member.routes";

jest.mock("@/modules/member/member.controller");

describe("Member Routes", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/v1/members", memberRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("DELETE /:memberId", () => {
    it("should call deleteMember and return deleted member", async () => {
      const fakeMember = { id: "m123", name: "Member Name" };
      (membersController.deleteMember as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          messsage: "Member deleted",
          member: fakeMember,
        });
      });

      const res = await request(app).delete("/api/v1/members/m123");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        messsage: "Member deleted",
        member: fakeMember,
      });
    });
  });

  describe("PATCH /:memberId", () => {
    it("should call updateMemberRole and return updated member", async () => {
      const updatedMember = {
        id: "m123",
        role: "ADMIN",
        user: { id: "u1", name: "John", email: "john@example.com" },
      };
      (membersController.updateMemberRole as jest.Mock).mockImplementation((req, res, next) => {
        return res.status(StatusCodes.OK).json({
          member: updatedMember,
          messsage: "Member role updated",
        });
      });

      const res = await request(app)
        .patch("/api/v1/members/m123")
        .send({ role: "ADMIN" });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({
        member: updatedMember,
        messsage: "Member role updated",
      });
    });
  });
});
