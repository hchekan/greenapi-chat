import { useMessagesByChatId } from "@store/messages/hooks";
import { useUserStore } from "@store/user/user.store";
import styles from "./ChatMessages.module.scss";
import type { Chat } from "@types/chats.types";
import type { Message, MessageToChangeStatus } from "@types/messages.types";
import { formatDateWithMonth } from "@utils/formatDate";
import MessageItem from "./MessageItem";
import { useMessageStore } from "@store/messages/messages.store";
import { useEffect } from "react";

interface ChatMessagesProps {
  chat: Chat;
}

const ChatMessages = ({ chat }: ChatMessagesProps) => {
  const user = useUserStore((state) => state.user);
  const messagesByChat = useMessagesByChatId(chat.chatId);
  const { changeStatusMessage } = useMessageStore();

  useEffect(() => {
    if (messagesByChat) {
      const messages = messagesByChat.data;
      const lengthMessages = messages.length;
      if (lengthMessages > 0 && messages[lengthMessages - 1].status === "new") {
        const lastMes = messages[lengthMessages - 1];

        const changeStatus = async () => {
          await changeStatusMessage({
            idMessage: lastMes.idMessage,
            chatId: lastMes.chatId,
            status: "read",
          });
        };

        changeStatus();
      }
    }
  }, [messagesByChat]);

  if (!user) {
    return;
  }

  if (!messagesByChat) {
    return (
      <div className={styles.chatMessagesContainer}>
        <div className={styles.chatMessages}>
          <div className={styles.emptyChat}>
            <div className={styles.emptyChatIcon}>{chat?.name[0]}</div>
            <h3 className={styles.emptyChatTitle}>Здесь пока пусто</h3>
          </div>
        </div>
      </div>
    );
  }

  const getDate = (timestamp: number) => {
    return formatDateWithMonth(timestamp);
  };

  const handleDeleteMessage = async (dataMes: MessageToChangeStatus) => {
    await changeStatusMessage(dataMes);
  };

  return (
    <div className={styles.chatMessagesContainer}>
      <div className={styles.chatMessagesBlock}>
        <div className={styles.chatMessages}>
          {messagesByChat.data.map((msg: Message, index: number) => {
            const currentDate = getDate(msg.timestamp);
            const showDate =
              index === 0 ||
              currentDate !== getDate(messagesByChat.data[index - 1].timestamp);

            return (
              <MessageItem
                key={msg.id}
                currentDate={currentDate}
                showDate={showDate}
                msg={msg}
                isOwn={msg.senderId === user.id}
                onDeleteMessage={handleDeleteMessage}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
