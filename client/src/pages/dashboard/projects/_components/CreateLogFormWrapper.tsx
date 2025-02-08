import { CreateLogForm } from "./CreateLogForm";

interface CreateLogFormWrapperProps {
  onCancel: () => void;
}

export const CreateLogFormWrapper = ({
  onCancel,
}: CreateLogFormWrapperProps) => {
  return <CreateLogForm onCancel={onCancel} />;
};
