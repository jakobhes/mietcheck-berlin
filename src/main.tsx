import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import './index.css';
import App from './App.tsx';
import { AnswersProvider } from './state/AnswersContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AnswersProvider>
      <App />
    </AnswersProvider>
  </StrictMode>,
);
