import '@mantine/core/styles.css';
import { MantineProvider, useMantineColorScheme } from '@mantine/core';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { useThemeStore } from './store/themeStore';

function ThemeSync() {
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useThemeStore((s) => s.colorScheme);

  useEffect(() => {
    setColorScheme(colorScheme);
  }, [colorScheme, setColorScheme]);

  return null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="light">
      <ThemeSync />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
);
