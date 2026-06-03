import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import AdminPage from './pages/AdminPage.tsx';
import CatalogPage from './pages/CatalogPage.tsx';
import PrivacyPage from './pages/PrivacyPage.tsx';
import TermsPage from './pages/TermsPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
