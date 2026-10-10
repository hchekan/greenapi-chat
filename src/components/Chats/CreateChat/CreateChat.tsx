import { useState } from "react";
import { useUserStore } from "@store/user/user.store";
import { useChatStore } from "@store/chats/chats.store";
import Modal from "@components/Modal";
import Button from "@components/Button";

import styles from "./CreateChat.module.scss";
import { error, success } from "@/components/notify/notify";

interface CreateChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateChat = ({ isOpen, onClose }: CreateChatProps) => {
  const user = useUserStore((state) => state.user);
  const { createChat } = useChatStore();

  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return;
    if (!phone.trim()) return;
    if (!user) return;

    const chat = {
      id: crypto.randomUUID(),
      chatId: phone + "@c.us",
      userId: user.id,
      phone: phone,
      name: title,
    };

    const createdChat = await createChat(chat);

    if (!createdChat) {
      error(`Не удалось создать чат "${title}"`, false);
      return;
    }

    success(`Чат "${title}" успешно создан`, true);

    setTitle("");
    setPhone("");

    onClose();
  };

  const handleCancel = () => {
    setTitle("");
    setPhone("");

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className={styles.title}>Новый чат</h3>

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
        <label>
          Номер телефона получателя*
          <input
            className={styles.input}
            type="number"
            placeholder="Номер телефона"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            disabled={!phone.trim() || !title.trim()}
          >
            Создать
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateChat;
