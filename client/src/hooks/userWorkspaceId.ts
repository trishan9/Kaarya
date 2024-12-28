import { useParams } from "react-router";

export const useWorkspaceId = () => {
    const params = useParams();
    return params.workspaceId as string;
};
