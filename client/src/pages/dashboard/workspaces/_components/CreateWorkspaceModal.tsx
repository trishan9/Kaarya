import { useCreateWorkspaceModal } from "@/hooks/_modals/useCreateWorkspaceModal";
import { CreateWorkspaceForm } from "./CreateWorkspaceForm";
import { ResponsiveModal } from "@/components/ResponsiveModal";

export const CreateWorkspaceModal = () => {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
};
