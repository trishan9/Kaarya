import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "react-toastify";
import { apiActions } from "@/api";
import {
  CreateWorkspaceSchema,
  updateWorkspaceSchema,
} from "@/pages/dashboard/workspaces/_schemas";
import { CustomAxiosError } from "@/api/axiosInstance";

export const useGetWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: apiActions.workspaces.getAll,
    retry: 1,
  });
};

export const useGetWorkspace = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => apiActions.workspaces.getById(workspaceId),
    retry: 1,
  });

  return query;
};

export const useGetWorkspaceInfo = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const query = useQuery({
    queryKey: ["workspace-info", workspaceId],
    queryFn: () => apiActions.workspaces.getInfoById(workspaceId),
    retry: 1,
  });

  return query;
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: z.infer<typeof updateWorkspaceSchema>;
    }) => {
      return await apiActions.workspaces.update(workspaceId, data);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", response?.data?.workspace?.id],
      });
    },
    onError: (error: CustomAxiosError) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update workspace";
      toast.error(errorMessage);
    },
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: { data: CreateWorkspaceSchema }) => {
      return await apiActions.workspaces.create(data);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error: CustomAxiosError) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId }: { workspaceId: string }) => {
      return await apiActions.workspaces.delete(workspaceId);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", response?.data?.workspace?.id],
      });
    },
    onError: (error: CustomAxiosError) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete workspace";
      toast.error(errorMessage);
    },
  });
};

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId }: { workspaceId: string }) => {
      return await apiActions.workspaces.resetInviteLink(workspaceId);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", response?.data?.workspace?.id],
      });
    },
    onError: (error: CustomAxiosError) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      inviteCode,
    }: {
      workspaceId: string;
      inviteCode: string;
    }) => {
      return await apiActions.workspaces.joinWorkspace(workspaceId, inviteCode);
    },
    onSuccess: ({ data }) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: (error: CustomAxiosError) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to join workspace";
      toast.error(errorMessage);
    },
  });
};
