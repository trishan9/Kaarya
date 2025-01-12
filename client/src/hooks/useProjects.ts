import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { z } from "zod";
import { apiActions } from "@/api";
import { CustomAxiosError } from "@/api/axiosInstance";
import {
  CreateProjectSchema,
  updateProjectSchema,
} from "@/pages/dashboard/projects/_schemas";

export const useGetProjects = ({ workspaceId }: { workspaceId: string }) => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => apiActions.projects.getAll(workspaceId),
    retry: 1,
  });
};

export const useGetProject = ({ projectId }: { projectId: string }) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => apiActions.projects.getById(projectId),
    retry: 1,
  });

  return query;
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: { data: CreateProjectSchema }) => {
      return await apiActions.projects.create(data);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: CustomAxiosError) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      data,
    }: {
      projectId: string;
      data: z.infer<typeof updateProjectSchema>;
    }) => {
      return await apiActions.projects.update(projectId, data);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", response?.data?.project?.id],
      });
    },
    onError: (error: CustomAxiosError) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update projects";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      return await apiActions.projects.delete(projectId);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", response?.data?.project?.id],
      });
    },
    onError: (error: CustomAxiosError) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete projects";
      toast.error(errorMessage);
    },
  });
};
