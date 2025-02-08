import { useEffect, useState } from "react";
import { Channel, Chat, Thread, Window } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { EmojiPicker } from "stream-chat-react/emojis";

import "stream-chat-react/dist/css/v2/index.css";
import "@/pages/dashboard/workspaces/_components/chat/chat.css";

import { useAuthStore } from "@/state-stores/auth";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { CustomChannelList } from "./_components/chat/CustomChannelList";
import { ChatMain } from "./_components/chat/ChatMain";

export const WorkspaceChatPage = () => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currUser = useAuthStore((state) => state.user);
  const streamToken = useAuthStore((state) => state.streamToken);
  const workspaceId = useWorkspaceId();

  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance(
        import.meta.env.VITE_APP_STREAM_KEY,
      );

      try {
        await client.connectUser(
          {
            id: currUser?.id || "",
            name: currUser?.name || "",
            image: `https://ui-avatars.com/api/?name=${currUser?.name}`,
          },
          streamToken,
        );

        setChatClient(client);
      } catch (error) {
        setError("Failed to connect to chat. Please try again later.");
        console.error("Chat connection failed:", error);
      }
    };

    initChat();
    return () => {
      chatClient?.disconnectUser();
    };
  }, [chatClient, currUser, streamToken]);

  if (!chatClient && !error) {
    return (
      <div className="flex h-[85vh] items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">
          Connecting to chat...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[85vh] items-center justify-center bg-background">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-[85vh] mt-6 md:mt-0 bg-background border rounded-lg overflow-hidden">
      <Chat client={chatClient as StreamChat} theme="str-chat__theme-light">
        <div className="flex h-full w-full overflow-hidden">
          <CustomChannelList workspaceId={workspaceId} />
          <div className="flex-1 overflow-hidden">
            <Channel EmojiPicker={EmojiPicker}>
              <Window>
                <ChatMain />
              </Window>
              <Thread />
            </Channel>
          </div>
        </div>
      </Chat>
    </div>
  );
};
