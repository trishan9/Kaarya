import { useParams } from "react-router";

export const useWorkspaceId = () => {
  const { workspaceId } = useParams();
  return workspaceId;
};
