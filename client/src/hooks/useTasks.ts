import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiActions } from "@/api";
import { CustomAxiosError } from "@/api/axiosInstance";
import { CreateTaskSchema } from "@/pages/dashboard/tasks/_schemas";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: { data: CreateTaskSchema }) => {
      return await apiActions.tasks.create(data);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: CustomAxiosError) => {
      toast.error(error?.response?.data?.message);
    },
  });
};
