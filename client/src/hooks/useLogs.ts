import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiActions } from "@/api";
import { CustomAxiosError } from "@/api/axiosInstance";

export const useGetLogs = ({ projectId }: { projectId: string }) => {
  return useQuery({
    queryKey: ["logs", projectId],
    queryFn: () => apiActions.logs.getAll(projectId),
    retry: 1,
  });
};

export const useCreateLogs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, data }: { projectId: string, data: any }) => {
      return await apiActions.logs.create(projectId,data);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["logs"],
      });
    },
    onError: (error: CustomAxiosError) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useUpdateLogs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      logsId,
      data,
    }: {
      logsId: string;
      data: any;
    }) => {
      return await apiActions.logs.update(logsId, data);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["logs"],
      });
    },
    onError: (error: CustomAxiosError) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update logs";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ logsId }: { logsId: string }) => {
      return await apiActions.logs.delete(logsId);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["logs"],
      });
    },
    onError: (error: CustomAxiosError) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete logs";
      toast.error(errorMessage);
    },
  });
};
