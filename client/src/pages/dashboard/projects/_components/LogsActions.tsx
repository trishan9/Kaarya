import React from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/useConfirm";
import { useDeleteLog } from "@/hooks/useLogs";
import { useEditLogModal } from "@/hooks/useEditLogModal";
import type { ActivityLogType } from "../_schemas";

interface LogActionsProps {
  id: string;
  logData: ActivityLogType;
  children: React.ReactNode;
}

export const LogsAction: React.FC<LogActionsProps> = ({
  children,
  id,
  logData,
}) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Log",
    "Are you sure you want to delete this log?",
    "destructive",
  );
  const { open } = useEditLogModal();
  const { mutate, isPending } = useDeleteLog();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate({ logsId: id });
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => {
              console.log("Attempting to open modal with data:", logData);
              open(logData);
            }}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-5 mr-2 stroke-2" />
            Edit Log
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="font-medium p-[10px] text-amber-700 focus:text-amber-700"
          >
            <TrashIcon className="size-5 mr-2 stroke-2" />
            Delete Log
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

