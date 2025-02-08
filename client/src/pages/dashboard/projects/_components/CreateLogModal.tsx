import { ResponsiveModal } from "@/components/ResponsiveModal";
import { CreateLogFormWrapper } from "./CreateLogFormWrapper";
import { useCreateLogModal } from "@/hooks/useCreateLogModal";

export const CreateLogModal = () => {
  const { isOpen, setIsOpen, close } = useCreateLogModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateLogFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
