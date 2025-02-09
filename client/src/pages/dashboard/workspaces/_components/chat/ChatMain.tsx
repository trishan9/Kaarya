import { useState } from "react";
import {
  MessageInput,
  MessageList,
  useChannelStateContext,
} from "stream-chat-react";
import { HeadphoneOffIcon, HeadphonesIcon, MessageSquare } from "lucide-react";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Button } from "@/components/ui/button";
import ConferenceRoom from "../video-conference/ConferenceRoom";

export const ChatMain = () => {
  const { channel } = useChannelStateContext();
  const [onHuddle, setOnHuddle] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b flex justify-between px-4 py-2 bg-neutral-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />

          <span className="font-semibold text-foreground">
            {channel?.data?.name || "Chat"}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setOnHuddle((prevState) => !prevState)}
        >
          {onHuddle ? <HeadphoneOffIcon /> : <HeadphonesIcon />}
          {onHuddle ? "Exit Huddle" : "Join Huddle"}
        </Button>
      </div>

      <div className="flex-grow overflow-hidden">
        {onHuddle ? (
          <div className="h-full">
            <ConferenceRoom
              channel={channel?.data?.name || ""}
              setOnHuddle={setOnHuddle}
            />
          </div>
        ) : (
          <MessageList />
        )}
      </div>

      {!onHuddle && <DottedSeparator />}

      <div className="py-2">{!onHuddle && <MessageInput focus />}</div>
    </div>
  );
};
