import { useQueryState, parseAsString } from "nuqs";
import type { ActivityLogType } from "@/pages/dashboard/projects/_schemas";

export const useEditLogModal = () => {
  const [logData, setLogData] = useQueryState("edit-log", parseAsString);

  const open = (data: ActivityLogType) =>
    setLogData(JSON.stringify(data) as string);
  const close = () => setLogData(null);

  return {
    logData,
    open,
    close,
    setLogData,
  };
};
