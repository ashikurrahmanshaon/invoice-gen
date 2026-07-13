import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import type { HelmetServerState } from 'react-helmet-async';
import AppServer from './AppServer';
import { SettingsProvider } from './contexts/SettingsContext';

export function render(url: string, helmetContext: { helmet?: HelmetServerState }) {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <SettingsProvider>
          <StaticRouter location={url}>
            <AppServer />
          </StaticRouter>
        </SettingsProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
  return { html };
}
