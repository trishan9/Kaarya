import { z } from "zod";

export enum UserRoles {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export const createMemberSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user ID format" }),
  workspaceId: z.string().uuid({ message: "Invalid workspace ID format" }),
  role: z.nativeEnum(UserRoles, { message: "Invalid role" }),
});

export type CreateMemberType = z.infer<typeof createMemberSchema>;
