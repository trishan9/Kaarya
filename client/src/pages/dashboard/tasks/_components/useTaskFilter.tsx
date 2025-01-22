import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { Priority, TaskStatus } from "../_schemas";

export const useTaskFilter = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    priority: parseAsStringEnum(Object.values(Priority)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};

