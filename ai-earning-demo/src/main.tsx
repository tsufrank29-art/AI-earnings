import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import HomeLayout from './layouts/HomeLayout';
import EarningsList from './pages/EarningsList';
import FollowList from './pages/FollowList';
import EarningsDetail from './pages/EarningsDetail';
import { EarningsProvider } from './context/EarningsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <EarningsProvider>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Navigate to="/list" replace />} />
            <Route path="list" element={<EarningsList />} />
            <Route path="follow" element={<FollowList />} />
            <Route path="detail/:callId" element={<EarningsDetail />} />
          </Route>
        </Routes>
      </EarningsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
