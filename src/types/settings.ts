export interface BusinessProfile {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  taxId: string;
  vatGst: string;
  companyRegistration: string;
}

export interface BrandKit {
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  defaultSignatureUrl: string | null;
}

export interface InvoiceDefaults {
  prefix: string;
  numberPattern: string; // e.g. "{PREFIX}-{YYYY}-{SEQ}"
  defaultDueDateDays: number;
  defaultTaxRate: number | '';
  defaultTaxLabel: string;
  defaultCurrency: string;
  defaultNotes: string;
  defaultTerms: string;
  defaultFooterNotes: string;
}

export interface PaymentMethods {
  bankTransfer: { enabled: boolean; bankName: string; accountName: string; accountNumber: string; routingNumber: string; swift: string; iban: string; };
  paypal: { enabled: boolean; email: string; link: string; };
  stripe: { enabled: boolean; link: string; };
  wise: { enabled: boolean; link: string; };
}

export interface ClientSettings {
  defaultCountry: string;
  defaultPaymentTerms: number;
  defaultCurrency: string;
}

export interface LocalizationSettings {
  language: string;
  currency: string;
  country: string;
  timezone: string;
  paperSize: 'A4' | 'Letter' | 'Legal';
  dateFormat: string;
  numberFormat: string;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  layoutMode: 'compact' | 'comfortable';
}

export interface Settings {
  _hasCompletedFirstRun: boolean;
  businessProfile: BusinessProfile;
  brandKit: BrandKit;
  localization: LocalizationSettings;
  invoiceDefaults: InvoiceDefaults;
  paymentMethods: PaymentMethods;
  clientSettings: ClientSettings;
  appearance: AppearanceSettings;
}

export const defaultSettings: Settings = {
  _hasCompletedFirstRun: false,
  businessProfile: {
    name: '', ownerName: '', email: '', phone: '', website: '',
    address: '', city: '', state: '', postalCode: '', country: '',
    taxId: '', vatGst: '', companyRegistration: ''
  },
  brandKit: {
    logoUrl: null,
    primaryColor: '#155EEF', // Default Stripe-ish blue
    secondaryColor: '#475467',
    accentColor: '#F9FAFB',
    defaultSignatureUrl: null
  },
  localization: {
    language: 'en',
    currency: 'USD',
    country: 'US',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    paperSize: 'A4',
    dateFormat: 'locale',
    numberFormat: 'locale'
  },
  invoiceDefaults: {
    prefix: 'INV',
    numberPattern: '{PREFIX}-{SEQ}',
    defaultDueDateDays: 14,
    defaultTaxRate: '',
    defaultTaxLabel: 'Tax',
    defaultCurrency: 'USD',
    defaultNotes: '',
    defaultTerms: 'Please pay within 14 days.',
    defaultFooterNotes: 'Thank you for your business.'
  },
  paymentMethods: {
    bankTransfer: { enabled: false, bankName: '', accountName: '', accountNumber: '', routingNumber: '', swift: '', iban: '' },
    paypal: { enabled: false, email: '', link: '' },
    stripe: { enabled: false, link: '' },
    wise: { enabled: false, link: '' }
  },
  clientSettings: {
    defaultCountry: 'US',
    defaultPaymentTerms: 14,
    defaultCurrency: 'USD'
  },
  appearance: {
    theme: 'system',
    fontSize: 'medium',
    layoutMode: 'comfortable'
  }
};
