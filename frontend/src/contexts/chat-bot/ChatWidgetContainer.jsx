import { useContext } from "react";
import { ChatBotContext } from "./ChatBotContext";
import ChatWidget from "./ChatWidget";

export default function ChatWidgetContainer() {
  const { history, sendMessage, loading } = useContext(ChatBotContext);

  return (
    <ChatWidget
      history={history}
      sendMessage={sendMessage}
      loading={loading}
    />
  );
}
