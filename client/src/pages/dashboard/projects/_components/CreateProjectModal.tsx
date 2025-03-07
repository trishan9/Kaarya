import { ResponsiveModal } from "@/components/ResponsiveModal";
import { CreateProjectForm } from "./CreateProjectForm";
import { useCreateProjectModal } from "@/hooks/_modals/useCreateProjectModal";

export const CreateProjectModal = () => {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};
