import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthStore = {
  accessToken: string | null;
  streamToken: string | null;
  user: User | null;
  isAuthenticated: boolean;

  setAccessToken: (token: string | null) => void;
  setStreamToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  streamToken: null,
  user: null,
  isAuthenticated: false,

  setAccessToken: (token) =>
    set({ accessToken: token, isAuthenticated: !!token }),
  setStreamToken: (token) => set({ streamToken: token }),
  setUser: (user) => set({ user }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
}));
