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