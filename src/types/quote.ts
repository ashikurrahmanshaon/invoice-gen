import type { BusinessDetails, ClientDetails, LineItem } from './invoice';

export interface QuoteDetails {
  quoteNumber: string;
  issueDate: string;
  validUntil: string;
  currency: string;
}

export interface QuoteTotals {
  subtotal: number;
  discountRate: number | string;
  discountType: 'percent' | 'flat';
  discountValue: number | string;
  discountAmount: number;
  taxRate: number | string;
  taxLabel?: string;
  taxAmount: number;
  shipping: number | string;
  total: number;
  amountPaid?: number | string;
  balanceDue?: number;
}

export interface QuoteData {
  business: BusinessDetails;
  client: ClientDetails;
  details: QuoteDetails;
  items: LineItem[];
  totals: QuoteTotals;
  notes: string;
  terms: string;
  signatureUrl: string | null;
}

export interface SavedQuote {
  id: string;
  dateSaved: string;
  data: QuoteData;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  previewHash?: string; // Short hash for determining if snapshot preview needs update
}
