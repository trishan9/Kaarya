import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateLogModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-log",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
