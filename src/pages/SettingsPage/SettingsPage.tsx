import useResizable from "@hooks/useResizable";

import styles from "./SettingsPage.module.scss";
import Settings from "@/components/Settings";

const SettingsPage = () => {
  const { width: sidebarWidth, handleMouseDown } = useResizable({
    minWidth: 300,
    maxWidth: 600,
    defaultWidth: 410,
    storageKey: "sidebar-width",
  });

  return (
    <aside
      className={styles.settingsPage}
      style={{ width: sidebarWidth + "px" }}
    >
      <div className={styles.settingsMain}>
        <div className={styles.header}>
          <h1>Настройки</h1>
        </div>

        <Settings />
      </div>

      <button
        className={styles.splitter}
        onMouseDown={handleMouseDown}
        aria-label="Изменить ширину"
      />
    </aside>
  );
};

export default SettingsPage;
