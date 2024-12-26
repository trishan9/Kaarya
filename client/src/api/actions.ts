import z from "zod";
import { api } from "./axiosInstance";
import { API_URLS } from "./urls";
import { loginFormSchema, registerFormSchema } from "@/pages/auth/_schemas";

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
};
