/**
 * Sentry Error Monitoring Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a free Sentry account at https://sentry.io
 * 2. Create a new React project in Sentry
 * 3. Copy your DSN from: Settings → Projects → [Your Project] → Client Keys (DSN)
 * 4. Replace the placeholder DSN below with your real DSN
 * 
 * The DSN format looks like: https://xxxxx@o123456.ingest.sentry.io/789
 */

import * as Sentry from '@sentry/react';

const SENTRY_DSN: string = '__SENTRY_DSN_PLACEHOLDER__';

const isProduction = typeof window !== 'undefined' && window.location.hostname === 'invoice-gen.net';
const isDsnConfigured = SENTRY_DSN !== '__SENTRY_DSN_PLACEHOLDER__' && SENTRY_DSN.startsWith('https://');

export function initSentry(): void {
  if (!isDsnConfigured) {
    if (isProduction) {
      console.warn('[Sentry] DSN not configured. Error monitoring is disabled. See src/config/sentry.ts for setup instructions.');
    }
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Only enable in production
    enabled: isProduction,
    
    // Performance monitoring sample rate (10% of transactions)
    tracesSampleRate: 0.1,
    
    // Session replay for debugging (disabled by default to save quota)
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.1,
    
    // Environment tag
    environment: isProduction ? 'production' : 'development',
    
    // Release tag — update with each deploy
    release: 'invoice-gen@1.0.0',

    // Filter out noisy, non-actionable errors
    ignoreErrors: [
      // Browser extensions
      /top\.GLOBALS/,
      /extensions\//i,
      /chrome-extension/,
      /moz-extension/,
      // Network errors (user's connection, not our fault)
      'Network request failed',
      'Failed to fetch',
      'Load failed',
      'NetworkError',
      // ResizeObserver (harmless browser noise)
      'ResizeObserver loop',
      // Safari-specific noise
      /Can't find variable: /,
    ],

    // Before sending: scrub sensitive data
    beforeSend(event) {
      // Remove any PII from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
          // Don't send form input values
          if (breadcrumb.category === 'ui.input') {
            return { ...breadcrumb, message: '[REDACTED]' };
          }
          return breadcrumb;
        });
      }
      return event;
    },
  });
}

/**
 * Manually capture a PDF generation error with extra context.
 */
export function capturePDFError(error: unknown, documentType: string): void {
  if (!isDsnConfigured) return;
  
  Sentry.withScope(scope => {
    scope.setTag('feature', 'pdf_generation');
    scope.setTag('document_type', documentType);
    scope.setLevel('error');
    
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(`PDF generation failed for ${documentType}: ${String(error)}`);
    }
  });
}

/**
 * Track a non-fatal issue (e.g., localStorage quota exceeded).
 */
export function captureWarning(message: string, context?: Record<string, string>): void {
  if (!isDsnConfigured) return;
  
  Sentry.withScope(scope => {
    scope.setLevel('warning');
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    Sentry.captureMessage(message);
  });
}

export { Sentry };
