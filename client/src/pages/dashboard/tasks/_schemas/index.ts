import { z } from "zod";

export type Task = {
    name: string;
    status: TaskStatus;
    assigneeId: string;
    workspaceId: string;
    projectId: string;
    position: number;
    dueDate: string;
    description?: string;
};

export enum TaskStatus {
    BACKLOG = "BACKLOG",
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    IN_REVIEW = "IN_REVIEW",
    DONE = "DONE",
}

export const createTaskSchema = z.object({
    name: z.string().trim().min(1, { message: "Required" }),
    status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
    workspaceId: z.string().trim().min(1, { message: "Required" }),
    projectId: z.string().trim().min(1, { message: "Required" }),
    assigneeId: z.string().trim().min(1, { message: "Required" }),
    dueDate: z.coerce.date(),
    description: z.string().optional(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;