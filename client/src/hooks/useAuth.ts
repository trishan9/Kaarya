import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuthStore } from "@/state-stores/auth";
import { apiActions } from "@/api";
import { CustomAxiosError } from "@/api/axiosInstance";

export const useLogin = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setStreamToken = useAuthStore((state) => state.setStreamToken);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiActions.auth.login,
    onSuccess: (response) => {
      const { accessToken, streamToken } = response.data;

      setAccessToken(accessToken);
      setStreamToken(streamToken);

      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success(response.data.message);
      navigate("/");
    },
    onError: (error: CustomAxiosError) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: apiActions.auth.register,
    onSuccess: (response) => {
      toast.dismiss();
      toast.success(response?.data?.message);
      navigate("/login");
    },
    onError: (error: CustomAxiosError) => {
      toast.error(error?.response?.data?.message ?? "");
    },
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: apiActions.auth.getMe,
    retry: false,
  });
};

export const useLogout = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setStreamToken = useAuthStore((state) => state.setStreamToken);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiActions.auth.logout,
    onSuccess: () => {
      setUser(null);
      setAccessToken(null);
      setStreamToken(null);
      setIsAuthenticated(false);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      window.location.href = "/";
    },
  });
};
