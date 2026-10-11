import { useState } from "react";
import { useChatStore } from "@store/chats/chats.store";
import Modal from "@components/Modal";
import Button from "@components/Button";

import styles from "./RenameChat.module.scss";
import { error, success } from "@/components/notify/notify";
import type { Chat } from "@/types/chats.types";

interface RenameChatProps {
  chat: Chat;
  isOpen: boolean;
  onClose: () => void;
}

const RenameChat = ({ chat, isOpen, onClose }: RenameChatProps) => {
  const { renameChat } = useChatStore();

  const [title, setTitle] = useState(chat.name);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    const renamedChat = await renameChat({...chat, name: title});

    if (!renamedChat) {
      error(`Не удалось переименовать чат "${title}"`, false);
      return;
    }

    success(`Чат "${title}" успешно переименован`, true);

    setTitle("");

    onClose();
  };

  const handleCancel = () => {
    setTitle("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className={styles.title}>{chat.name}</h3>

      <div className={styles.form}>
        <label>
          Название чата*
          <input
            className={styles.input}
            type="text"
            placeholder="Название чата"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <div className={styles.buttons}>
          <Button
            className={styles.button}
            size="sm"
            weight="medium"
            variant="outline"
            onClick={handleCancel}
          >
            Отменить
          </Button>
          <Button
            className={styles.button}
            size="sm"
            weight="medium"
            onClick={handleSubmit}
            disabled={!title.trim()}
          >
            Переименовать
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RenameChat;
