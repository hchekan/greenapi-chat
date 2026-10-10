import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '@components/Sidebar';
import { useNotifications } from '@hooks/useNotifications';

export interface LayoutContextType {
  onOpenChat: (chatId: string) => void;
  onCloseChat: () => void;
}

const AppLayout = () => {
  useNotifications();

  const location = useLocation();
  const navigate = useNavigate();

  const getActiveSection = (): string => {
    if (location.pathname.startsWith('/c/')) return 'chats';
    if (location.pathname === '/settings') return 'settings';
    return 'chats';
  };

  const activeSection = getActiveSection();

  const switchSection = (section: string) => {
    if (section === 'chats') {
      navigate('/');
    } else {
      navigate(`/${section}`);
    }
  };

  const openChat = (chatId: string) => {
    navigate(`/c/${chatId}`);
  };

  const closeChat = () => {
    navigate('/');
  };

  return (
    <div className="app">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={switchSection}
      />

      <main className="content">
        <Outlet context={{ onOpenChat: openChat, onCloseChat: closeChat }} />
      </main>
    </div>
  );
};

export default AppLayout;