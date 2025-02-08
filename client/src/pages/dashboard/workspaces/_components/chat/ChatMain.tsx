import {
  MessageInput,
  MessageList,
  useChannelStateContext,
} from "stream-chat-react";
import { MessageSquare } from "lucide-react";
import { DottedSeparator } from "@/components/ui/dotted-separator";

export const ChatMain = () => {
  const { channel } = useChannelStateContext();

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-4 py-3 bg-neutral-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />

          <span className="font-semibold text-foreground">
            {channel?.data?.name || "Chat"}
          </span>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <MessageList />
      </div>

      <DottedSeparator />

      <div className="py-2">
        <MessageInput focus />
      </div>
    </div>
  );
};
