import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from './router/AppRouter';
import AppToast from './common/components/AppToast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
    <AppToast />
  </StrictMode>,
);
