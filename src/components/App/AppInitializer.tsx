import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '@store/user/user.store';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer = ({ children }: AppInitializerProps) => {
  const { user, isInitialized, initialize } = useUserStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  if (!isInitialized) {
    return (
      <div className="loading-screen">
        Загрузка приложения...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
};

export default AppInitializer;