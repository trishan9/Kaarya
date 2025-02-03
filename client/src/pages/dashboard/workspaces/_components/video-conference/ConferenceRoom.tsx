import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { apiActions } from "@/api";
import { Loader2 } from "lucide-react";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export default function ConferenceRoom({
  channel,
  setOnHuddle,
}: {
  channel: string;
  setOnHuddle: Dispatch<SetStateAction<boolean>>;
}) {
  const workspaceId = useWorkspaceId();
  const room = `${workspaceId}-${channel}`;
  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const resp = await apiActions.livekit.getToken(room);
        setToken(resp?.data?.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [room]);

  if (token === "") {
    return (
      <div className="flex flex-col h-full flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Connecting to Kaarya Huddle...
        </p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      connect={true}
      token={token}
      serverUrl={import.meta.env.VITE_APP_LIVEKIT_URL}
      onDisconnected={() => setOnHuddle(false)}
      data-lk-theme="default"
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
