import { useOutletContext } from "react-router-dom";
import type { LayoutContextType } from "@components/App/AppLayout";
import { useChatById } from "@store/chats/hooks";
import ChatHeader from '@chats/Chat/ChatHeader';
import ChatMessages from '@chats/Chat/ChatMessages';
import ChatInput from '@chats/Chat/ChatInput';

import styles from "./ChatArea.module.scss";

interface ChatAreaProps {
  chatId: string;
}

const ChatArea = ({ chatId }: ChatAreaProps) => {
  const chat = useChatById(chatId);
  const { onCloseChat } = useOutletContext<LayoutContextType>();

  if(!chat) {
    onCloseChat();
    return;
  }

  return (
    <div className={styles.chatArea}>
      <ChatHeader chat={chat} />
      <ChatMessages chat={chat} />
      <ChatInput chatId={chatId} />
    </div>
  );
};

export default ChatArea;