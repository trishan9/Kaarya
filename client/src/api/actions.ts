import z from "zod";
import { api } from "./axiosInstance";
import { API_URLS } from "./urls";
import { loginFormSchema, registerFormSchema } from "@/pages/auth/_schemas";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "@/pages/dashboard/workspaces/_schemas";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@/pages/dashboard/projects/_schemas";
import { createTaskSchema } from "@/pages/dashboard/tasks/_schemas";
import { useGetTasksProps } from "@/hooks/useTasks";
import { BulkUpdateParams } from "@/pages/dashboard/tasks/_components/TaskViewSwitcher";

export const apiActions = {
  auth: {
    register: async (data: z.infer<typeof registerFormSchema>) => {
      return await api.post(API_URLS.AUTH.REGISTER, data);
    },
    login: async (credentials: z.infer<typeof loginFormSchema>) => {
      return await api.post(API_URLS.AUTH.LOGIN, credentials);
    },
    logout: async () => {
      return await api.post(API_URLS.AUTH.LOGOUT);
    },
    refresh: async () => {
      return await api.post(API_URLS.AUTH.REFRESH);
    },
    getMe: async () => {
      return await api.get(API_URLS.AUTH.ME);
    },
  },
  workspaces: {
    getAll: async () => {
      return await api.get(API_URLS.WORKSPACES);
    },
    getById: async (workspaceId: string) => {
      return await api.get(`${API_URLS.WORKSPACES}/${workspaceId}`);
    },
    getInfoById: async (workspaceId: string) => {
      return await api.get(`${API_URLS.WORKSPACES}/${workspaceId}/info`);
    },
    delete: async (workspaceId: string) => {
      return await api.delete(`${API_URLS.WORKSPACES}/${workspaceId}`);
    },
    create: async (data: z.infer<typeof createWorkspaceSchema>) => {
      return await api.post(
        API_URLS.WORKSPACES,
        data,
        MULTIPART_FORM_DATA_CONFIG,
      );
    },
    update: async (
      workspaceId: string,
      data: z.infer<typeof updateWorkspaceSchema>,
    ) => {
      return await api.patch(
        `${API_URLS.WORKSPACES}/${workspaceId}`,
        data,
        MULTIPART_FORM_DATA_CONFIG,
      );
    },
    resetInviteLink: async (workspaceId: string) => {
      return await api.post(
        `${API_URLS.WORKSPACES}/${workspaceId}/reset-invite-code`,
      );
    },
    joinWorkspace: async (workspaceId: string, inviteCode: string) => {
      return await api.post(`${API_URLS.WORKSPACES}/${workspaceId}/join`, {
        inviteCode,
      });
    },
    workspaceAnalytics: async (workspaceId: string) => {
      return await api.get(`${API_URLS.WORKSPACES}/${workspaceId}/analytics`);
    },
  },
  members: {
    remove: async (memberId: string) => {
      return await api.delete(`${API_URLS.MEMBERS}/${memberId}`);
    },
    update: async (memberId: string, role: string) => {
      return await api.patch(`${API_URLS.MEMBERS}/${memberId}`, { role });
    },
  },
  projects: {
    getAll: async (workspaceId: string) => {
      return await api.get(`${API_URLS.PROJECTS}?workspaceId=${workspaceId}`);
    },
    getById: async (projectId: string) => {
      return await api.get(`${API_URLS.PROJECTS}/${projectId}`);
    },
    create: async (data: z.infer<typeof createProjectSchema>) => {
      return await api.post(
        API_URLS.PROJECTS,
        data,
        MULTIPART_FORM_DATA_CONFIG,
      );
    },
    update: async (
      projectId: string,
      data: z.infer<typeof updateProjectSchema>,
    ) => {
      return await api.patch(
        `${API_URLS.PROJECTS}/${projectId}`,
        data,
        MULTIPART_FORM_DATA_CONFIG,
      );
    },
    delete: async (projectId: string) => {
      return await api.delete(`${API_URLS.PROJECTS}/${projectId}`);
    },
    projectAnalytics: async (projectId: string) => {
      return await api.get(`${API_URLS.PROJECTS}/${projectId}/analytics`);
    },
  },
  tasks: {
    getById: async (taskId: string) => {
      return await api.get(`${API_URLS.TASKS}/${taskId}`);
    },
    getAll: async (query: useGetTasksProps) => {
      return await api.get(API_URLS.TASKS, { params: query });
    },
    create: async (data: z.infer<typeof createTaskSchema>) => {
      return await api.post(API_URLS.TASKS, data);
    },
    update: async (taskId: string, data: unknown) => {
      return await api.patch(`${API_URLS.TASKS}/${taskId}`, data);
    },
    delete: async (taskId: string) => {
      return await api.delete(`${API_URLS.TASKS}/${taskId}`);
    },
    bulkUpdate: async (data: BulkUpdateParams[]) => {
      return await api.post(`${API_URLS.TASKS}/bulk-update`, { tasks: data });
    },
  },
  logs: {
    getAll: async (projectId: string) => {
      return await api.get(`${API_URLS.LOGS}/projects/${projectId}`);
    },
    create: async (projectId: string, data: any) => {
      return await api.post(`${API_URLS.LOGS}/projects/${projectId}`, data);
    },
    update: async (logsId: string, data: unknown) => {
      return await api.patch(`${API_URLS.LOGS}/${logsId}`, data);
    },
    delete: async (logsId: string) => {
      return await api.delete(`${API_URLS.LOGS}/${logsId}`);
    },
  },
  livekit: {
    getToken: async (room: string) => {
      return await api.get(`${API_URLS.LIVEKIT}?room=${room}}`);
    },
  },
};

const MULTIPART_FORM_DATA_CONFIG = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};
