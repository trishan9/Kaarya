import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiActions } from "@/api";
import { CustomAxiosError } from "@/api/axiosInstance";

export const useGetMembers = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: ["member", workspaceId],
    queryFn: () => apiActions.workspaces.getById(workspaceId),
    retry: 1,
  });

  return query;
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ memberId }: { memberId: string }) => {
      return await apiActions.members.remove(memberId);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", response.data.member.workspaceId],
      });
      toast.success(response?.data?.message);
    },
    onError: (error: CustomAxiosError) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to remove member";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      role,
    }: {
      memberId: string;
      role: string;
    }) => {
      return await apiActions.members.update(memberId, role);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["members"] });
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
