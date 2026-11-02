import { DirectionProvider, MantineProvider } from '@mantine/core';
import '@fontsource-variable/inter';
import '@fontsource-variable/noto-sans-arabic';
import '@mantine/core/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import './index.css';
import App from './App.tsx';
import { AnswersProvider } from './state/AnswersContext';
import { theme } from './theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DirectionProvider>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <AnswersProvider>
          <App />
        </AnswersProvider>
      </MantineProvider>
    </DirectionProvider>
  </StrictMode>,
);
