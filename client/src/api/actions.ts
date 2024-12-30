import z from "zod";
import { api } from "./axiosInstance";
import { API_URLS } from "./urls";
import { loginFormSchema, registerFormSchema } from "@/pages/auth/_schemas";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "@/pages/dashboard/workspaces/_schemas";

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
  },
};

const MULTIPART_FORM_DATA_CONFIG = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};
