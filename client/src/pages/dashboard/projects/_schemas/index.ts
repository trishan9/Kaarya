import { z } from "zod";

export type Project = {
  name: string;
  imageUrl: string;
  id: string;
  workspaceId?: string;
};

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

export const ActivityTypeEnum = z.enum([
  "SPRINT_PLANNING",
  "SPRINT_REVIEW",
  "SPRINT_RETROSPECTIVE",
  "DAILY_SCRUM",
  "OTHERS",
])

export type ActivityType = z.infer<typeof ActivityTypeEnum>

export const ActivityLogSchema = z.object({
  content: z.string().min(1, "Content is required").max(500, "Content must be 500 characters or less"),
  type: ActivityTypeEnum,
})

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
export type ActivityLogInput = z.infer<typeof ActivityLogSchema>
