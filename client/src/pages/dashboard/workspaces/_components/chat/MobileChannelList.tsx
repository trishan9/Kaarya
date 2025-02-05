import { useState } from "react";
import { ChannelList, useChatContext } from "stream-chat-react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CustomChannelPreview } from "./CustomChannelPreview";

export const MobileChannelList = ({ workspaceId }: { workspaceId: string }) => {
  const { channel: activeChannel } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="absolute w-1/3 top-16 left-4 ml-2 my-1 z-10"
        >
          Select Channel
          <ChevronDown className="h-5 w-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-60 p-2 mt-2 bg-neutral-100"
        onInteractOutside={(e) => {
          if (activeChannel) {
            e.preventDefault();
          }
        }}
      >
        <div className="space-y-4" onClick={() => setIsOpen(false)}>
          <div className="px-2 mt-1">
            <div className="font-semibold text-sm text-muted-foreground">
              Channels
            </div>
          </div>

          <ChannelList
            filters={{
              type: "team",
              workspace_id: workspaceId,
            }}
            sort={{ last_message_at: -1 }}
            options={{ state: true, presence: true, limit: 10 }}
            Preview={CustomChannelPreview}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
