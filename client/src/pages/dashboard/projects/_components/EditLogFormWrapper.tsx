import React from "react";
import { EditLogForm } from "./EditLogForm";
import type { ActivityLogType } from "../_schemas";

interface EditLogFormWrapperProps {
  onCancel: () => void;
  logData: ActivityLogType;
}

export const EditLogFormWrapper: React.FC<EditLogFormWrapperProps> = ({
  onCancel,
  logData,
}) => {
  return <EditLogForm logData={logData} onCancel={onCancel} />;
};
