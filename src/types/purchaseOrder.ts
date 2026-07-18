import { BusinessDetails, ClientDetails, LineItem, InvoiceTotals } from './invoice';

export interface PODetails {
  poNumber: string;
  poDate: string;
  expectedDeliveryDate: string;
  currency: string;
  themeColor?: string;
  layoutId?: string;
}

export interface PurchaseOrderData {
  buyer: BusinessDetails; // Your company details
  vendor: ClientDetails;  // The supplier you are buying from
  details: PODetails;
  items: LineItem[];
  totals: InvoiceTotals;
  notes: string;
  terms: string;
  signatureUrl: string | null;
}

export type PurchaseOrderDraftData = Omit<PurchaseOrderData, 'buyer'>;

export type POStatus = 'Draft' | 'Saved' | 'Sent' | 'Approved' | 'Void';

export interface SavedPurchaseOrder {
  id: string;
  createdAt: number;
  updatedAt: number;
  status: POStatus;
  schemaVersion: number;
  data: PurchaseOrderData;
}
