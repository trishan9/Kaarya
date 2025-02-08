import { ChannelList } from "stream-chat-react";
import { CustomChannelPreview } from "./CustomChannelPreview";
import { MobileChannelList } from "./MobileChannelList";

export const CustomChannelList = ({ workspaceId }: { workspaceId: string }) => {
  return (
    <>
      <div className="hidden md:block w-60 flex-shrink-0 bg-neutral-100 border-r p-2">
        <div className="space-y-4">
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
      </div>

      <div className="md:hidden">
        <MobileChannelList workspaceId={workspaceId} />
      </div>
    </>
  );
};
