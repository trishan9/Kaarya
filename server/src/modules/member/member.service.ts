import { db } from "@/db";
import { CreateMemberType } from "./member.validator";

export const create = async (memberData: CreateMemberType) => {
  return await db.member.create({
    data: memberData,
  });
};
