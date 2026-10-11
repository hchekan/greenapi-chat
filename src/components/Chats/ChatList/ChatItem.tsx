import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import type { LayoutContextType } from "@components/App/AppLayout";
import { useChatById } from "@store/chats/hooks";
import { useLastMessageByChatId } from "@store/messages/hooks";
import styles from "./ChatList.module.scss";
import { formatSmartDate } from '@/utils/formatDate';
import MessageStatus from "../Chat/MessageStatus";
import NotifyIcon from "@icons/notify.svg?react";
import type { Chat } from "@/types/chats.types";

interface ChatItemProps {
  chatId: string;
  userId: string;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chat: Chat) => void;
}

const ChatItem = ({ chatId, userId, onDeleteChat, onRenameChat }: ChatItemProps) => {
  const chat = useChatById(chatId);
  const lastMessage = useLastMessageByChatId(chatId);
  const { onOpenChat } = useOutletContext<LayoutContextType>();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  if(!chat) {
    return null;
  }

  const getTime = () => {
    if(lastMessage?.timestamp) {
      return formatSmartDate(lastMessage.timestamp);
    } else {
      return "";
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  const handleDelete = () => {
    onDeleteChat(chatId);
    setContextMenu(null);
  };

  const handleRename = () => {
    onRenameChat(chat);
    setContextMenu(null);
  }

  return (<>
    <li
      key={chatId}
      className={styles.chatItem}
      onClick={() => onOpenChat(chatId)}
      onContextMenu={handleContextMenu}
    >
      <div className={styles.avatar}>{chat.name[0]}</div>
      <div className={styles.chatInfo}>
        <div className={styles.chatInfoMes}>
          <div className={styles.chatName}>{chat.name}</div>
          {lastMessage?.status === 'deleted' && <div className={styles.chatMsgDeleted}>Сообщение было удалено.</div>}
          {lastMessage?.status !== 'deleted' && <div className={styles.chatMsg}>
            {lastMessage?.text || ""}&nbsp;
            
          </div>}
          
        </div>
        <div className={styles.chatNotifyStatus}>
          <div className={styles.chatStatusTime}>
            <MessageStatus status={lastMessage?.status || ""} isOwn={lastMessage?.senderId === userId} />
            <div className={styles.chatActions}>{getTime()}&nbsp;</div>
          </div>
          {lastMessage?.status === 'new' && <NotifyIcon className={styles.notify}/>}
        </div>
        
      </div>
    </li>

    {contextMenu && (
      <div
        ref={menuRef}
        className={styles.contextMenu}
        style={{ top: contextMenu.y, left: contextMenu.x }}
      >
        <button className={`${styles.contextMenuItemBase} ${styles.contextMenuItem}`} onClick={handleRename}>
          Переименовать чат
        </button>
        <button className={`${styles.contextMenuItemBase} ${styles.contextMenuItemDelete}`} onClick={handleDelete}>
          Удалить чат
        </button>
      </div>
    )}
  </>);
};

export default ChatItem;
