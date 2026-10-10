import ChatsIcon from "@icons/chat.svg?react"; 
import SettingsIcon from "@icons/settings.svg?react";

import styles from "./Sidebar.module.scss";

const menuItems = [
  { id: 'chats', icon: ChatsIcon, label: 'Чаты' },
];

const Sidebar = ({ activeSection, onSectionChange }) => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.menu}>
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`${styles.menuItem} ${activeSection === item.id ? styles.active : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon className={styles.icon} />
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </nav> 

      <button
        className={`${styles.menuItem} ${styles.settingsBtn} ${activeSection === 'settings' ? styles.active : ''}`}
        onClick={() => onSectionChange('settings')}
      >
        <SettingsIcon className={styles.icon}/>
        <span className={styles.label}>Настройки</span>
      </button>
    </aside>
  );
}

export default Sidebar;