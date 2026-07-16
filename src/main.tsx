import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './styles/globals.css';
import './utils/i18n';
import { SettingsProvider } from './contexts/SettingsContext';

const container = document.getElementById('root');
if (container) {
  const isPrerendered = container.hasChildNodes();
  const app = (
    <React.StrictMode>
      <HelmetProvider>
        <SettingsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SettingsProvider>
      </HelmetProvider>
    </React.StrictMode>
  );

  if (isPrerendered) {
    // Due to localStorage state initialization (which guarantees a mismatch with SSR) 
    // and complex mobile layouts, React 18 hydration frequently fails and duplicates the DOM.
    // We manually clear the container to guarantee a clean render. 
    // SEO is unaffected as crawlers read the SSR HTML without executing JS.
    container.innerHTML = '';
  }
  ReactDOM.createRoot(container).render(app);
}
