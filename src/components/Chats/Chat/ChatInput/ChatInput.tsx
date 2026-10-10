import { useState, useEffect, useRef } from "react";
import { useMessageStore } from "@store/messages/messages.store";
import { useUserStore } from "@store/user/user.store";
import SendIcon from "@icons/send.svg?react";

import styles from "./ChatInput.module.scss";

interface ChatInputProps {
  chatId: string;
}

const ChatInput = ({ chatId }: ChatInputProps) => {
  
  const user = useUserStore((state) => state.user);
  const { sendMessage } = useMessageStore();

  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto"; 
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
  }, [text]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (text.trim() && user) {
      await sendMessage({
        id: crypto.randomUUID(),
        idMessage: "",
        senderId: user.id,
        timestamp: Date.now(),
        chatId: chatId,
        text,
        status: "",
      });

      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  return (
    <div className={styles.chatInputContainer}>
      <form className={styles.chatInput} onSubmit={handleSubmit}>

        <textarea
          ref={textareaRef}
          placeholder="Сообщение"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          className={styles.inputField}
        />

        <div className={styles.inputActions}>
          {text.trim() && (
            <button type="submit" className={styles.sendButton}>
              <SendIcon className={styles.icon} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
