import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@store/user/user.store';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; 
}

export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const { user, isInitialized, initialize } = useUserStore();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50vh' }}>
        Загрузка приложения...
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/setup" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/chat" replace />;
  }

  return <>{children}</>;
};