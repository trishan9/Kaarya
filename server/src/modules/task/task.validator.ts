import { z } from "zod";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  COMPLETED = "COMPLETED",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export type Task = {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  position: number;
  dueDate: string;
  sprint?: string;
  storyPoints?: string;
  assigneeId: string;
  projectId: string;
  workspaceId: string;
};

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, { message: "Required" }),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  priority: z.nativeEnum(Priority, { required_error: "Required" }),
  dueDate: z.coerce.date(),
  sprint: z.string().optional(),
  storyPoints: z.string().optional(),

  projectId: z.string().trim().min(1, { message: "Required" }),
  assigneeId: z.string().trim().min(1, { message: "Required" }),
  workspaceId: z.string().trim().min(1, { message: "Required" }),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
