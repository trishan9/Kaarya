import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiActions } from "@/api";
import { CustomAxiosError } from "@/api/axiosInstance";

export const useRemoveMember = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ memberId }: { memberId: string }) => {
        return await apiActions.members.remove(memberId);
      },
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ["members"] });
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        queryClient.invalidateQueries({ queryKey: ["workspace", response.data.member.workspaceId] });
        toast.success(response?.data?.message);
      },
      onError: (error: CustomAxiosError) => {
        const errorMessage =
          error?.response?.data?.message || "Failed to remove member";
        toast.error(errorMessage);
      },
    });
  };