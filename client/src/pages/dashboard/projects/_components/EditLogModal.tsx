import { ResponsiveModal } from "@/components/ResponsiveModal";
import { useEditLogModal } from "@/hooks/useEditLogModal";
import { EditLogFormWrapper } from "./EditLogFormWrapper";
import { ActivityLogType } from "../_schemas";

export const EditLogModal = () => {
  const { logData, close } = useEditLogModal();

  return (
    <ResponsiveModal open={!!logData} onOpenChange={close}>
      {logData && (
        <EditLogFormWrapper
          logData={JSON.parse(logData) as ActivityLogType}
          onCancel={close}
        />
      )}
    </ResponsiveModal>
  );
};

