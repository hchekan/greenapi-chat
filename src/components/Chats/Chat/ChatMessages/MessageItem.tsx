import React, { useState, useEffect, useRef } from "react";
import styles from "./ChatMessages.module.scss";
import type { Message, MessageToChangeStatus } from "@types/messages.types";
import { formatTime } from "@utils/formatDate";
import MessageStatus from "@/components/Chats/Chat/MessageStatus";

interface MessageItemProps {
  currentDate: string;
  showDate: boolean;
  msg: Message;
  isOwn: boolean;
  onDeleteMessage: (dataMsg: MessageToChangeStatus) => void;
}

const MessageItem = ({
  currentDate,
  showDate,
  msg,
  isOwn,
  onDeleteMessage
}: MessageItemProps) => {

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
    onDeleteMessage({
      chatId: msg.chatId,
      idMessage: msg.idMessage,
      status: 'deleted'
    });
    setContextMenu(null);
  };

  const getTime = (timestamp: number) => {
    return formatTime(timestamp);
  };

  return (
    <React.Fragment key={msg.id}>
      {showDate && (
        <div className={styles.dateSeparator}>
          <span>{currentDate}</span>
        </div>
      )}
      <div
        className={`${styles.message} ${isOwn ? styles.messageOwn : styles.messageOther}`}
        onContextMenu={handleContextMenu}
      >
        <div className={styles.messageBubble}>
          {msg.status === "deleted" && (
            <span className={styles.messageDeleted}>
              Сообщение было удалено.
            </span>
          )}
          {msg.status !== "deleted" && (
            <span className={styles.messageText}>{msg.text}</span>
          )}

          <span className={styles.messageStatusTime}>
            <span className={styles.messageTime}>{getTime(msg.timestamp)}</span>
            <MessageStatus
              status={msg.status}
              isOwn={isOwn}
            />
          </span>
        </div>
      </div>

      {contextMenu && (
        <div
          ref={menuRef}
          className={styles.contextMenu}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button className={styles.contextMenuItem} onClick={handleDelete}>
            Удалить сообщение
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

export default MessageItem;
