import { useQueryState, parseAsString } from "nuqs";
import type { ActivityLogType } from "@/pages/dashboard/projects/_schemas" 

export const useEditLogModal = () => {
const [logData, setLogData] = useQueryState("edit-log", parseAsString);

  const open = (data: ActivityLogType) => setLogData(data as any)
  const close = () => setLogData(null)

  return {
    logData,
    open,
    close,
    setLogData
  }
}

