import type { BusinessDetails, ClientDetails, LineItem } from './invoice';

export interface EstimateDetails {
  estimateNumber: string;
  issueDate: string;
  validUntil: string;
  currency: string;
}

export interface EstimateTotals {
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

export interface EstimateData {
  business: BusinessDetails;
  client: ClientDetails;
  details: EstimateDetails;
  items: LineItem[];
  totals: EstimateTotals;
  notes: string;
  terms: string;
  signatureUrl: string | null;
}

export interface SavedEstimate {
  id: string;
  dateSaved: string;
  data: EstimateData;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  previewHash?: string; // Short hash for determining if snapshot preview needs update
}
