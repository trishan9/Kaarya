export const API_URLS = {
  BASE: import.meta.env.VITE_APP_API_BASE_URL,
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
  WORKSPACES: "/workspaces",
  MEMBERS: "/members",
  PROJECTS: "/projects",
  TASKS: "/tasks",
  LOGS: "/logs",
};
