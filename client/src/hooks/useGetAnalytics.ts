import { apiActions } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceAnalytics = ({ workspaceId } : { workspaceId : string }) => {
    return useQuery({
        queryKey: ["workspaces-analytics", workspaceId],
        queryFn: () => apiActions.workspaces.workspaceAnalytics(workspaceId),
        retry: 1,
      });
};

export const useProjectAnalytics = ({ projectId } : { projectId : string }) => {
    return useQuery({
        queryKey: ["projects-analytics", projectId],
        queryFn: () => apiActions.projects.projectAnalytics(projectId),
        retry: 1,
      });
};

