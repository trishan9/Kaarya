import { useParams } from "react-router";

export const useTaskId = () => {
  const params = useParams();
  return params.taskId as string;
};

