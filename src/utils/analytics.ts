/**
 * Invoice-Gen.net Analytics Utility
 * Lightweight wrapper around gtag() for GA4 custom event tracking.
 * Tracks the invoice creation funnel and key conversion actions.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type EventName =
  | 'generate_invoice'
  | 'download_pdf'
  | 'preview_invoice'
  | 'save_draft'
  | 'complete_invoice'
  | 'copy_invoice'
  | 'print_invoice'
  | 'funnel_step'
  | 'generate_invoice_pdf'
  | 'generate_quote_pdf'
  | 'generate_estimate_pdf'
  | 'generate_purchase_order_pdf'
  | 'download_image'
  | 'template_selected'
  | 'brand_logo_uploaded'
  | 'guide_opened'
  | 'blog_opened'
  | 'share_link';

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track a GA4 custom event. Silently no-ops if gtag is not loaded.
 */
export function trackEvent(name: EventName, params?: EventParams): void {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, params);
    }
  } catch {
    // Silently fail — analytics should never break the app
  }
}

/**
 * Track funnel progression through invoice creation stages.
 */
export function trackFunnelStep(step: number, label: string): void {
  trackEvent('funnel_step', {
    step_number: step,
    step_label: label,
    funnel_name: 'invoice_creation'
  });
}
