import { useState } from "react";
import { useUserStore } from "@store/user/user.store";
import { useChatStore } from "@store/chats/chats.store";
import { useMessageStore } from "@store/messages/messages.store";
import type { User } from "@types/user.types";
import { db } from "@db/indexed-db";

import styles from "./Settings.module.scss";
import Button from "@components/Button";
import { info, error } from "@components/notify/notify";

const Settings = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearChats = useChatStore((state) => state.clearChats);
  const clearMessages = useMessageStore((state) => state.clearMessages);

  const [name, setName] = useState(user?.name || "");
  const [idInstance, setIdInstance] = useState(user?.id || "");
  const [apiUrl, setApiUrl] = useState(user?.apiUrl || "");
  const [apiTokenInstance, setApiTokenInstance] = useState(
    user?.apiTokenInstance || "",
  );

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const newUser: User = {
      id: idInstance,
      apiUrl,
      apiTokenInstance,
      name,
    };

    if (user && idInstance !== user.id) {
      try {
        await Promise.all(db.tables.map((table) => table.clear()));
        clearChats();
        clearMessages();
      } catch (err) {
        error("Ошибка при очистке indexedDB");
      }
    }
    
    setUser(newUser);
    info("Данные были изменены", true);
  };

  return (
    <div className={styles.settings}>
      <p>При изменении idInstance чаты будут сброшены </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Ваше имя*
          <input
            className={styles.input}
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Ваш idInstance*
          <input
            className={styles.input}
            type="text"
            placeholder="Ваш idInstance"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            required
          />
        </label>
        <label>
          Ваш apiUrl*
          <input
            className={styles.input}
            type="text"
            placeholder="Ваш apiUrl"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            required
          />
        </label>
        <label>
          Ваш apiTokenInstance*
          <input
            className={styles.input}
            type="text"
            placeholder="Ваш apiTokenInstance"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            required
          />
        </label>

        <Button
          className={styles.button}
          size="md"
          weight="medium"
          fullWidth={true}
          type="submit"
          disabled={
            !name.trim() ||
            !idInstance.trim() ||
            !apiTokenInstance.trim() ||
            !apiUrl.trim()
          }
        >
          Изменить
        </Button>
      </form>
    </div>
  );
};

export default Settings;
