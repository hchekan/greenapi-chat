import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserStore } from "@store/user/user.store";
import { useChatStore } from "@store/chats/chats.store";
import { useMessageStore } from "@store/messages/messages.store";

import ChatArea from "@chats/Chat/ChatArea";
import ChatList from "@chats/ChatList";

import styles from "./ChatsPage.module.scss";

const ChatsPage = () => {
  const idInstance = useUserStore((state) => state.user?.id);
  const { isFirstLoaded, chatIds, loadChats } = useChatStore();
  const { loadMessages } = useMessageStore();

  const { chatId } = useParams();

  useEffect(() => {
    if (idInstance) {
      const fetchChats = async () => {
        await loadChats(idInstance);
      };
      fetchChats();
    }
  }, [idInstance]);

  useEffect(() => {
    if (isFirstLoaded) {
      const fetchMessages = async (id: string) => {
        await loadMessages(id);
      };

      chatIds.forEach((id) => {
        fetchMessages(id);
      });
    }
  }, [isFirstLoaded]);

  return (
    <div className={styles.chats}>
      <ChatList />

      {chatId && <ChatArea chatId={chatId} />}
    </div>
  );
};

export default ChatsPage;
