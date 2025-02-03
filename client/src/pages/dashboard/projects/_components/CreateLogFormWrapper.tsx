import { CreateLogForm } from "./CreateLogForm"

interface CreateLogFormWrapperProps {
  onCancel: () => void
}

export const CreateLogFormWrapper = ({ onCancel }: CreateLogFormWrapperProps) => {
  // You can add any necessary data fetching or processing here
  // For now, we'll just render the CreateLogForm

  return <CreateLogForm onCancel={onCancel} />
}

