import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { LayoutContextType } from "@components/App/AppLayout";
import useResizable from "@hooks/useResizable";
import useModal from "@hooks/useModal";
import CreateChat from "../CreateChat";
import { useChatStore } from "@store/chats/chats.store";
import { useUserStore } from "@store/user/user.store";

import styles from "./ChatList.module.scss";
import ChatItem from "./ChatItem";
import RenameChat from "../RenameChat";
import type { Chat } from "@/types/chats.types";

const ChatList = () => {
  const userId = useUserStore((state) => state.user?.id);
  const { onCloseChat } = useOutletContext<LayoutContextType>();

  const [ chat, setChat ] = useState<Chat | null>(null);
  const { isLoaded, error, chatIds, deleteChat } = useChatStore();
  const { isOpen, open, close } = useModal();
  const { isOpen: isOpenRename, open: openRename, close: closeRename } = useModal();
  const { width: sidebarWidth, handleMouseDown } = useResizable({
    minWidth: 300,
    maxWidth: 600,
    defaultWidth: 410,
    storageKey: "sidebar-width",
  });

  const handleDeleteChat = async (chatId: string) => {
    onCloseChat();
    await deleteChat(chatId);
  };

   const handleRenameChat = async (chat: Chat) => {
     setChat(chat);
     openRename();
  };

  return (
    <aside className={styles.chatsPage} style={{ width: sidebarWidth + "px" }}>
      <CreateChat isOpen={isOpen} onClose={close} />
      {chat && <RenameChat chat={chat} isOpen={isOpenRename} onClose={closeRename} />}

      <div className={styles.chatsMain}>
        <div className={styles.header}>
          <h1>Чаты</h1>
          <button className={styles.newChatBtn} onClick={open}>
            <div className={styles.plus}>+</div>
          </button>
        </div>

        {!isLoaded && (
          <div className={styles.statusInfo}>Идет загрузка чатов...</div>
        )}
        {error && (
          <div className={styles.statusError}>Ошибка при загрузке чатов.</div>
        )}

        {isLoaded && !error && (
          <>
            {/* <input
              type="text"
              placeholder="Найти"
              className={styles.searchInput}
            /> */}

            <ul className={styles.chatList}>
              {chatIds.map((id) => (
                <ChatItem
                  key={id}
                  chatId={id}
                  userId={userId || ""}
                  onDeleteChat={handleDeleteChat}
                  onRenameChat={handleRenameChat}
                />
              ))}
            </ul>
          </>
        )}
      </div>

      <button
        className={styles.splitter}
        onMouseDown={handleMouseDown}
        aria-label="Изменить ширину"
      />
    </aside>
  );
};

export default ChatList;
