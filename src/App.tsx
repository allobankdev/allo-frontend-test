import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RocketProvider } from './context/RocketContext';
import { RocketListPage } from './pages/RocketListPage';
import { RocketDetailPage } from './pages/RocketDetailPage';

export const App: React.FC = () => {
  return (
    <RocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RocketListPage />} />
          <Route path="/rockets/:id" element={<RocketDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </RocketProvider>
  );
};

