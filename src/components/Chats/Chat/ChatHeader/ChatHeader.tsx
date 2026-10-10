import { useOutletContext } from "react-router-dom";
import type { LayoutContextType } from "@components/App/AppLayout";
import styles from "./ChatHeader.module.scss";
import type { Chat } from "@types/chats.types";

interface ChatHeaderProps {
  chat: Chat;
}

const ChatHeader = ({ chat }: ChatHeaderProps) => {
  const { onCloseChat } = useOutletContext<LayoutContextType>();

  return (
    <div className={styles.chatHeader}>
      <div className={styles.chatHeaderLeft}>
        <button className={styles.backButton} onClick={onCloseChat} >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="white"/>
          </svg>
        </button>
        <div className={styles.chatAvatar}>{chat.name[0]}</div>
        <div className={styles.chatInfo}>
          <h2 className={styles.chatTitle}>{chat.name}</h2>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader; 