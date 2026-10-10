import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppInitializer from './AppInitializer';
import AppLayout from './AppLayout';
import ChatsPage from '@pages/ChatsPage';
import SettingsPage from '@pages/SettingsPage';
import SetupPage from '@pages/SetupPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup" element={<SetupPage />} />
        <Route
          path="/"
          element={
            <AppInitializer>
              <AppLayout />
            </AppInitializer>
          }
        >
          <Route index element={<ChatsPage />} />
          <Route path="c/:chatId" element={<ChatsPage />} />

          <Route path="settings" element={<SettingsPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;