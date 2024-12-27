import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, { message: "Required" }),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  userId: z.string()
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Must be 1 or more characters long" })
    .optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
export const inviteCodeSchema = z.object({ code: z.string() });

export type CreateWorkspaceType = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceType = z.infer<typeof updateWorkspaceSchema>;
