import { db } from "@/db";
import { CreateMemberType } from "./members.validator";

export const create = async (memberData: CreateMemberType) => {
  return await db.members.create({
    data: memberData,
  });
};



