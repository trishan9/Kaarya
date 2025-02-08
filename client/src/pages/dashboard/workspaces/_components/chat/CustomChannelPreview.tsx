import { ChannelPreviewUIComponentProps } from "stream-chat-react";
import { Hash } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CustomChannelPreview = (props: ChannelPreviewUIComponentProps) => {
  const { channel, setActiveChannel, active } = props;
  const { name } = channel.data || {};

  return (
    <Button
      variant="ghost"
      className={`w-full justify-start px-2 border-none py-1 text-left text-sm ${
        active
          ? "border bg-gray-100 text-accent-foreground"
          : "hover:bg-gray/50 hover:text-accent-foreground"
      }`}
      onClick={() => {
        setActiveChannel?.(channel);
      }}
    >
      <Hash className="mr-2 h-4 w-4" />
      {name}
    </Button>
  );
};
