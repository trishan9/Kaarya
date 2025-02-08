import config from "@/config";
import { StreamChat } from "stream-chat";

export const streamClient = StreamChat.getInstance(
  config.stream.apiKey,
  config.stream.apiSecret,
);
