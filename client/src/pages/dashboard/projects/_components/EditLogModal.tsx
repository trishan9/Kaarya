import { ResponsiveModal } from "@/components/ResponsiveModal"
import { useEditLogModal } from "@/hooks/useEditLogModal"
import { EditLogFormWrapper } from "./EditLogFormWrapper"

export const EditLogModal = () => {
  const { logData, close } = useEditLogModal()

  return (
    <ResponsiveModal open={!!logData} onOpenChange={close}>
      {logData && <EditLogFormWrapper logData={logData as any} onCancel={close} />}
    </ResponsiveModal>
  )
}