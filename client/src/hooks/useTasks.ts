import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiActions } from "@/api";
import { CustomAxiosError } from "@/api/axiosInstance";
import { CreateTaskSchema, Priority, TaskStatus } from "@/pages/dashboard/tasks/_schemas";

export interface useGetTasksProps {
    workspaceId: string;
    projectId?: string | null;
    status?: TaskStatus | null;
    priority?: Priority | null;
    assigneeId?: string | null;
    dueDate?: string | null;
    search?: string | null;
}

export const useGetTasks = ({
  workspaceId,
  assigneeId,
  projectId,
  dueDate,
  search,
  status,
  priority
}: useGetTasksProps) => {
  const query = useQuery({
      queryKey: [
          "tasks",
          workspaceId,
          projectId,
          status,
          priority,
          search,
          assigneeId,
          dueDate,
      ],
      queryFn: async () => {
          console.log(priority)
          const response = await apiActions.tasks.getAll({
                  workspaceId,
                  projectId: projectId ?? undefined,
                  status: status ?? undefined,
                  priority: priority ?? undefined,
                  search: search ?? undefined,
                  assigneeId: assigneeId ?? undefined,
                  dueDate: dueDate ?? undefined,
          });

          if (!response.data) {
              throw new Error("Failed to get tasks");
          }

          return response.data;
      },
  });

  return query;
};

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
