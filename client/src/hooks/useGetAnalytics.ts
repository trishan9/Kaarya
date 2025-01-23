import { apiActions } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceAnalytics = ({ workspaceId } : { workspaceId : string }) => {
    return useQuery({
        queryKey: ["workspaces-analytics", workspaceId],
        queryFn: () => apiActions.workspaces.workspaceAnalytics(workspaceId)
      });
};

export const useGetProjectAnalytics = ({ projectId } : { projectId : string }) => {
    return useQuery({
        queryKey: ["projects-analytics", projectId],
        queryFn: () => apiActions.projects.projectAnalytics(projectId)
      });
};

