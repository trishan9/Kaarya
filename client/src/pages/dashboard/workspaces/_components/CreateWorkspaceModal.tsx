<<<<<<< HEAD
import { useCreateWorkspaceModal } from "@/hooks/useCreateWorkspaceModal";
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
=======
import { ResponsiveModal } from "../../../../components/ResponsiveModal";
import { useCreateWorkspaceModal } from "@/hooks/useCreateWorkspaceModal";
import { CreateWorkspaceForm } from "./CreateWorkspaceForm";

export const CreateWorkspaceModal = () => {
    const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();
    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateWorkspaceForm onCancel={close} />
        </ResponsiveModal>
    );
};
>>>>>>> 5c73382 (feat: setting page layout)
