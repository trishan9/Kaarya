import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, { message: "Required" }),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),

  workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Minimum 1 character required" })
    .optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export type UpdateProjectType = z.infer<typeof updateProjectSchema>;
export type CreateProjectType = z.infer<typeof createProjectSchema>;

export interface CreateProjectInput {
  userId: string;
  image: unknown | null;
  name: string;
  workspaceId: string;
}
