import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './styles/globals.css';
import './utils/i18n';
import { SettingsProvider } from './contexts/SettingsContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initSentry, Sentry } from './config/sentry';

// Initialize error monitoring before anything else
initSentry();

// Track unhandled promise rejections (PDF generation, fetch failures, etc.)
window.addEventListener('unhandledrejection', (event) => {
  Sentry.captureException(event.reason || new Error('Unhandled promise rejection'));
});

const container = document.getElementById('root');
if (container) {
  const isPrerendered = container.hasChildNodes();
  const app = (
    <React.StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <SettingsProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SettingsProvider>
        </HelmetProvider>
      </ErrorBoundary>
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
