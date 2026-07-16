export interface BusinessDetails {
  name: string;
  email: string;
  logoUrl: string | null;
  phone: string;
  website: string;
  taxId?: string;
  address?: string; // Legacy field for backwards compatibility
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface ClientDetails {
  name: string;
  email: string;
  phone: string;
  taxId?: string;
  address?: string; // Legacy field for backwards compatibility
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface SavedClient extends ClientDetails {
  id: string;
  lastUsed: number;
}

export const STORAGE_KEY_CLIENTS = 'invoice_gen_clients';

export interface LineItem {
  id: string;
  name: string;
  description: string;
  rate: number | string;
  quantity: number | string;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  themeColor?: string;
  layoutId?: string; // Kept as optional string for backwards compatibility with saved history
}

export interface InvoiceTotals {
  subtotal: number;
  discountRate: number; // Legacy, kept for backward compat if needed, but not primarily used
  discountType: 'percent' | 'flat';
  discountValue: number | string;
  taxLabel?: string;
  taxRate: number | string;
  shipping: number | string;
  amountPaid: number | string;
  discountAmount: number;
  taxAmount: number;
  total: number;
  balanceDue: number;
}

export interface InvoiceData {
  business: BusinessDetails;
  client: ClientDetails;
  details: InvoiceDetails;
  items: LineItem[];
  totals: InvoiceTotals;
  notes: string;
  terms: string;
  paymentInstructions: string;
  signatureUrl: string | null;
}

export type InvoiceDraftData = Omit<InvoiceData, 'business'>;

export interface ProfileData {
  business: BusinessDetails;
  currency: string;
}

export type InvoiceStatus = 'Draft' | 'Saved' | 'Sent' | 'Paid' | 'Void';

export interface SavedInvoice {
  id: string;
  createdAt: number;
  updatedAt: number;
  status: InvoiceStatus;
  schemaVersion: number;
  data: InvoiceData;
}

