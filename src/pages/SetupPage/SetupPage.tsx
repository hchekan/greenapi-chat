import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@store/user/user.store";
import Button from "@components/Button";
import type { User } from "@types/user.types";

import styles from "./SetupPage.module.scss";

const SetupPage = () => {
  const [name, setName] = useState("");
  const [idInstance, setIdInstance] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    const newUser: User = {
      id: idInstance,
      apiUrl,
      apiTokenInstance,
      name,
    };

    setUser(newUser);

    navigate("/chat", { replace: true });
  };

  return (
    <div className={styles.setupPageContainer}>
      <div className={styles.setupPage}>
        <h2>Добро пожаловать!</h2>
        <p>Пожалуйста, введите необходимые данные, чтобы начать.</p>

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
            size="md"
            weight="medium"
            fullWidth={true}
            type="submit"
            disabled={!name.trim() || !idInstance.trim() || !apiTokenInstance.trim() || !apiUrl.trim()}
            className={styles.button}
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SetupPage;
