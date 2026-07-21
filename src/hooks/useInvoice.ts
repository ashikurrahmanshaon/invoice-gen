import { useState, useCallback, useMemo, useEffect } from 'react';
import type { InvoiceData, LineItem } from '../types/invoice';
import { calculateTotals, normalizeDecimalString } from '../utils/calculations';
import { loadHydratedData, clearDraftStorage, clearAllStorage } from '../utils/storage';
import { generateInvoiceNumber } from '../utils/invoiceNumber';

const generateId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

const createDefaultLineItem = (): LineItem => ({
  id: generateId(),
  name: '',
  description: '',
  rate: '',
  quantity: '1'
});

export const defaultInvoice: InvoiceData = {
  business: {
    name: '',
    email: '',
    logoUrl: null,
    phone: '',
    website: '',
    taxId: '',
    address: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  },
  client: {
    name: '',
    email: '',
    address: '',
    phone: '',
    taxId: ''
  },
  details: {
    invoiceNumber: generateInvoiceNumber(),
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD'
  },
  items: [createDefaultLineItem()],
  totals: {
    subtotal: 0,
    discountRate: 0,
    discountType: 'percent',
    discountValue: '',
    taxLabel: 'Tax',
    taxRate: '',
    shipping: '',
    amountPaid: '',
    discountAmount: 0,
    taxAmount: 0,
    total: 0,
    balanceDue: 0
  },
  notes: '',
  terms: '',
  paymentInstructions: '',
  signatureUrl: null
};



import type { Settings } from '../types/settings';

const buildPaymentInstructions = (pm?: Settings['paymentMethods']): string => {
  if (!pm) return '';
  const lines: string[] = [];
  
  if (pm.bankTransfer?.enabled) {
    lines.push('Bank Transfer:');
    if (pm.bankTransfer.bankName) lines.push(`Bank: ${pm.bankTransfer.bankName}`);
    if (pm.bankTransfer.accountName) lines.push(`Name: ${pm.bankTransfer.accountName}`);
    if (pm.bankTransfer.accountNumber) lines.push(`Account: ${pm.bankTransfer.accountNumber}`);
    if (pm.bankTransfer.routingNumber) lines.push(`Routing: ${pm.bankTransfer.routingNumber}`);
    if (pm.bankTransfer.swift) lines.push(`SWIFT/BIC: ${pm.bankTransfer.swift}`);
    if (pm.bankTransfer.iban) lines.push(`IBAN: ${pm.bankTransfer.iban}`);
    lines.push('');
  }
  
  if (pm.paypal?.enabled && pm.paypal.link) {
    lines.push(`PayPal: ${pm.paypal.link}`);
  }
  
  if (pm.stripe?.enabled && pm.stripe.link) {
    lines.push(`Pay via Credit Card: ${pm.stripe.link}`);
  }

  if (pm.wise?.enabled && pm.wise.link) {
    lines.push(`Wise: ${pm.wise.link}`);
  }

  return lines.join('\n').trim();
};

export const STORAGE_KEY_ACTIVE_HISTORY_ID = 'invoice_gen_active_history_id';
export const STORAGE_KEY_ORIGINAL_SNAPSHOT = 'invoice_gen_original_snapshot';

export const useInvoice = (initialSettings?: Settings) => {
  const [data, setData] = useState<InvoiceData>(() => {
    const defaultWithSettings = {
      ...defaultInvoice,
      business: initialSettings?.businessProfile ? {
        name: initialSettings.businessProfile.name,
        ownerName: initialSettings.businessProfile.ownerName,
        email: initialSettings.businessProfile.email,
        phone: initialSettings.businessProfile.phone,
        website: initialSettings.businessProfile.website,
        address: initialSettings.businessProfile.address,
        address1: initialSettings.businessProfile.address,
        address2: '',
        city: initialSettings.businessProfile.city,
        state: initialSettings.businessProfile.state,
        postalCode: initialSettings.businessProfile.postalCode,
        country: initialSettings.businessProfile.country,
        taxId: initialSettings.businessProfile.taxId,
        companyRegistration: initialSettings.businessProfile.companyRegistration,
        vatGst: initialSettings.businessProfile.vatGst,
        logoUrl: initialSettings.brandKit.logoUrl
      } : defaultInvoice.business,
      details: { 
        ...defaultInvoice.details, 
        currency: initialSettings?.invoiceDefaults.defaultCurrency || 'USD',
        themeColor: initialSettings?.brandKit.primaryColor || '#155EEF'
      },
      totals: { 
        ...defaultInvoice.totals, 
        taxLabel: initialSettings?.invoiceDefaults.defaultTaxLabel || 'Tax',
        taxRate: initialSettings?.invoiceDefaults.defaultTaxRate || ''
      },
      notes: initialSettings?.invoiceDefaults.defaultNotes || '',
      terms: initialSettings?.invoiceDefaults.defaultTerms || '',
      paymentInstructions: buildPaymentInstructions(initialSettings?.paymentMethods)
    };
    const hydrated = loadHydratedData(defaultWithSettings);
    
    // Safe Data Migration: If legacy address exists but new structured fields are missing
    if (hydrated.business && hydrated.business.address && !hydrated.business.address1 && !hydrated.business.city && !hydrated.business.country) {
      hydrated.business.address1 = hydrated.business.address;
    }

    const totals = hydrated.totals || {};
    totals.subtotal = Number(totals.subtotal) || 0;
    totals.discountType = totals.discountType === 'flat' ? 'flat' : 'percent';
    
    const legacyDiscountVal = totals.discountValue !== undefined ? totals.discountValue : totals.discountRate;
    totals.discountValue = normalizeDecimalString(legacyDiscountVal);
    totals.discountRate = totals.discountType === 'percent' ? (Number(totals.discountValue) || 0) : 0;
    
    totals.taxLabel = typeof totals.taxLabel === 'string' && totals.taxLabel.trim() !== '' ? totals.taxLabel.trim() : 'Tax';
    totals.taxRate = normalizeDecimalString(totals.taxRate);
    totals.shipping = normalizeDecimalString(totals.shipping);
    totals.amountPaid = normalizeDecimalString(totals.amountPaid);
    
    totals.discountAmount = Number(totals.discountAmount) || 0;
    totals.taxAmount = Number(totals.taxAmount) || 0;
    totals.total = Number(totals.total) || 0;
    totals.balanceDue = Number(totals.balanceDue) || 0;
    
    if (Array.isArray(hydrated.items)) {
      hydrated.items = hydrated.items.map((item: any) => ({
        ...item,
        rate: item.rate !== undefined ? item.rate : 0,
        quantity: item.quantity !== undefined ? item.quantity : 1
      }));
    }

    hydrated.totals = calculateTotals(
      hydrated.items || [],
      totals.discountValue,
      totals.discountType,
      totals.taxRate,
      totals.taxLabel,
      totals.shipping,
      totals.amountPaid
    ) as any;

    return hydrated;
  });

  const [selectedSavedClientId, setSelectedSavedClientId] = useState<string | null>(null);

  const [loadedHistoryId, setLoadedHistoryId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY_ACTIVE_HISTORY_ID) || null;
  });

  const [originalSnapshot, setOriginalSnapshot] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY_ORIGINAL_SNAPSHOT) || null;
  });

  // Calculate isDirty: if we have an original snapshot, compare it. 
  // If not, we are a new invoice. A new invoice is dirty if it differs from default values.
  // Actually, we can just initialize originalSnapshot on first load if null.
  
  // To avoid constant JSON.stringify, we do it in a memoized callback.
  const isDirty = useMemo(() => {
    if (originalSnapshot === null) return true;
    return JSON.stringify(data) !== originalSnapshot;
  }, [data, originalSnapshot]);

  // Handle async IP detection: if settings load later and user hasn't modified anything, apply them.
  useEffect(() => {
    if (!isDirty && initialSettings) {
      setData(prev => {
        if (
          prev.details.currency === initialSettings.invoiceDefaults.defaultCurrency && 
          prev.totals.taxLabel === initialSettings.invoiceDefaults.defaultTaxLabel
        ) {
          return prev;
        }
        return {
          ...prev,
          details: { ...prev.details, currency: initialSettings.invoiceDefaults.defaultCurrency },
          totals: { ...prev.totals, taxLabel: initialSettings.invoiceDefaults.defaultTaxLabel }
        };
      });
    }
  }, [initialSettings, isDirty]);

  const setOriginalSnapshotForCurrentData = useCallback((newData: InvoiceData, newHistoryId: string | null) => {
    const snapshot = JSON.stringify(newData);
    setOriginalSnapshot(snapshot);
    setLoadedHistoryId(newHistoryId);
    try {
      localStorage.setItem(STORAGE_KEY_ORIGINAL_SNAPSHOT, snapshot);
      if (newHistoryId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_HISTORY_ID, newHistoryId);
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_HISTORY_ID);
      }
    } catch (e) {
      console.error('Failed to save snapshot metadata', e);
    }
  }, []);

  const loadInvoiceFromHistory = useCallback((historyId: string, historyData: InvoiceData) => {
    setData(historyData);
    setOriginalSnapshotForCurrentData(historyData, historyId);
  }, [setOriginalSnapshotForCurrentData]);

  const updateBusiness = useCallback((updates: Partial<InvoiceData['business']>) => {
    setData(prev => ({ ...prev, business: { ...prev.business, ...updates } }));
  }, []);

  const updateClient = useCallback((updates: Partial<InvoiceData['client']>) => {
    setData(prev => ({ ...prev, client: { ...prev.client, ...updates } }));
  }, []);

  const updateDetails = useCallback((updates: Partial<InvoiceData['details']>) => {
    setData(prev => ({ ...prev, details: { ...prev.details, ...updates } }));
  }, []);

  const addItem = useCallback(() => {
    setData(prev => {
      const newItem = createDefaultLineItem();
      const newItems = [...prev.items, newItem];
      return {
        ...prev,
        items: newItems,
        totals: calculateTotals(newItems, prev.totals.discountValue, prev.totals.discountType, prev.totals.taxRate, prev.totals.taxLabel, prev.totals.shipping, prev.totals.amountPaid)
      };
    });
  }, []);

  const duplicateItem = useCallback((id: string) => {
    setData(prev => {
      const itemToCopy = prev.items.find(i => i.id === id);
      if (!itemToCopy) return prev;
      
      const newItem: LineItem = { ...itemToCopy, id: generateId() };
      const index = prev.items.findIndex(i => i.id === id);
      const newItems = [...prev.items];
      newItems.splice(index + 1, 0, newItem);
      
      return {
        ...prev,
        items: newItems,
        totals: calculateTotals(newItems, prev.totals.discountValue, prev.totals.discountType, prev.totals.taxRate, prev.totals.taxLabel, prev.totals.shipping, prev.totals.amountPaid)
      };
    });
  }, []);

  const moveItemUp = useCallback((id: string) => {
    setData(prev => {
      const index = prev.items.findIndex(i => i.id === id);
      if (index <= 0) return prev;
      const newItems = [...prev.items];
      const temp = newItems[index];
      newItems[index] = newItems[index - 1];
      newItems[index - 1] = temp;
      return {
        ...prev,
        items: newItems,
        totals: calculateTotals(newItems, prev.totals.discountValue, prev.totals.discountType, prev.totals.taxRate, prev.totals.taxLabel, prev.totals.shipping, prev.totals.amountPaid)
      };
    });
  }, []);

  const moveItemDown = useCallback((id: string) => {
    setData(prev => {
      const index = prev.items.findIndex(i => i.id === id);
      if (index < 0 || index >= prev.items.length - 1) return prev;
      const newItems = [...prev.items];
      const temp = newItems[index];
      newItems[index] = newItems[index + 1];
      newItems[index + 1] = temp;
      return {
        ...prev,
        items: newItems,
        totals: calculateTotals(newItems, prev.totals.discountValue, prev.totals.discountType, prev.totals.taxRate, prev.totals.taxLabel, prev.totals.shipping, prev.totals.amountPaid)
      };
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setData(prev => {
      let newItems = prev.items.filter(i => i.id !== id);
      if (newItems.length === 0) {
        const itemToReset = prev.items.find(i => i.id === id);
        const resetItem = { ...createDefaultLineItem(), id: itemToReset?.id || generateId() };
        newItems = [resetItem];
      }
      return {
        ...prev,
        items: newItems,
        totals: calculateTotals(newItems, prev.totals.discountValue, prev.totals.discountType, prev.totals.taxRate, prev.totals.taxLabel, prev.totals.shipping, prev.totals.amountPaid)
      };
    });
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<LineItem>) => {
    setData(prev => {
      const newItems = prev.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      return {
        ...prev,
        items: newItems,
        totals: calculateTotals(newItems, prev.totals.discountValue, prev.totals.discountType, prev.totals.taxRate, prev.totals.taxLabel, prev.totals.shipping, prev.totals.amountPaid)
      };
    });
  }, []);

  const setItems = useCallback((items: LineItem[]) => {
    setData(prev => ({
      ...prev,
      items,
      totals: calculateTotals(items, prev.totals.discountValue, prev.totals.discountType, prev.totals.taxRate, prev.totals.taxLabel, prev.totals.shipping, prev.totals.amountPaid)
    }));
  }, []);

  const updateOtherFields = useCallback((updates: Partial<Pick<InvoiceData, 'notes' | 'terms' | 'paymentInstructions' | 'signatureUrl'>>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const setDiscount = useCallback((value: number | string, type: 'percent' | 'flat') => {
    setData(prev => ({
      ...prev,
      totals: calculateTotals(prev.items, value, type, prev.totals.taxRate, prev.totals.taxLabel, prev.totals.shipping, prev.totals.amountPaid)
    }));
  }, []);

  const setTaxRate = useCallback((rate: number | string) => {
    setData(prev => ({
      ...prev,
      totals: calculateTotals(prev.items, prev.totals.discountValue, prev.totals.discountType, rate, prev.totals.taxLabel, prev.totals.shipping, prev.totals.amountPaid)
    }));
  }, []);

  const setTaxLabel = useCallback((label: string) => {
    setData(prev => ({
      ...prev,
      totals: calculateTotals(prev.items, prev.totals.discountValue, prev.totals.discountType, prev.totals.taxRate, label, prev.totals.shipping, prev.totals.amountPaid)
    }));
  }, []);

  const setShipping = useCallback((amount: number | string) => {
    setData(prev => ({
      ...prev,
      totals: calculateTotals(prev.items, prev.totals.discountValue, prev.totals.discountType, prev.totals.taxRate, prev.totals.taxLabel, amount, prev.totals.amountPaid)
    }));
  }, []);

  const setAmountPaid = useCallback((amount: number | string) => {
    setData(prev => ({
      ...prev,
      totals: calculateTotals(prev.items, prev.totals.discountValue, prev.totals.discountType, prev.totals.taxRate, prev.totals.taxLabel, prev.totals.shipping, amount)
    }));
  }, []);

  const createNewInvoice = useCallback(() => {
    clearDraftStorage();
    setData(prev => {
      setSelectedSavedClientId(null);
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (initialSettings?.invoiceDefaults.defaultDueDateDays || 14));

      const newData = {
        ...defaultInvoice,
        business: initialSettings?.businessProfile ? {
          name: initialSettings.businessProfile.name,
          ownerName: initialSettings.businessProfile.ownerName,
          email: initialSettings.businessProfile.email,
          phone: initialSettings.businessProfile.phone,
          website: initialSettings.businessProfile.website,
          address: initialSettings.businessProfile.address,
          address1: initialSettings.businessProfile.address,
          address2: '',
          city: initialSettings.businessProfile.city,
          state: initialSettings.businessProfile.state,
          postalCode: initialSettings.businessProfile.postalCode,
          country: initialSettings.businessProfile.country,
          taxId: initialSettings.businessProfile.taxId,
          companyRegistration: initialSettings.businessProfile.companyRegistration,
          vatGst: initialSettings.businessProfile.vatGst,
          logoUrl: initialSettings.brandKit.logoUrl
        } : prev.business,
        details: {
          ...defaultInvoice.details,
          invoiceNumber: generateInvoiceNumber(prev.details.invoiceNumber), 
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          currency: initialSettings?.invoiceDefaults.defaultCurrency || prev.details.currency,
          themeColor: initialSettings?.brandKit.primaryColor || '#155EEF'
        },
        totals: {
          ...defaultInvoice.totals,
          taxLabel: initialSettings?.invoiceDefaults.defaultTaxLabel || 'Tax',
          taxRate: initialSettings?.invoiceDefaults.defaultTaxRate || ''
        },
        notes: initialSettings?.invoiceDefaults.defaultNotes || '',
        terms: initialSettings?.invoiceDefaults.defaultTerms || '',
        paymentInstructions: buildPaymentInstructions(initialSettings?.paymentMethods)
      };
      setOriginalSnapshotForCurrentData(newData, null);
      return newData;
    });
  }, [setOriginalSnapshotForCurrentData, initialSettings]);

  const resetEverything = useCallback((cancelPendingSave: () => void, clearHistory: boolean = false) => {
    cancelPendingSave();
    if (clearHistory) {
      clearAllStorage();
    } else {
      clearDraftStorage();
      localStorage.removeItem('invoice_gen_profile');
      localStorage.removeItem('invoice_gen_clients');
    }
    const freshData = {
      ...defaultInvoice,
      details: {
        ...defaultInvoice.details,
        invoiceNumber: generateInvoiceNumber(),
        currency: initialSettings?.invoiceDefaults.defaultCurrency || 'USD'
      },
      totals: {
        ...defaultInvoice.totals,
        taxLabel: initialSettings?.invoiceDefaults.defaultTaxLabel || 'Tax'
      }
    };
    setOriginalSnapshotForCurrentData(freshData, null);
    setData(freshData);
  }, [setOriginalSnapshotForCurrentData, initialSettings]);

  return {
    data,
    selectedSavedClientId,
    setSelectedSavedClientId,
    updateBusiness,
    updateClient,
    updateDetails,
    updateOtherFields,
    addItem,
    updateItem,
    duplicateItem,
    moveItemUp,
    moveItemDown,
    removeItem,
    setItems,
    setDiscount,
    setTaxRate,
    setTaxLabel,
    setShipping,
    setAmountPaid,
    createNewInvoice,
    resetEverything,
    loadedHistoryId,
    isDirty,
    setOriginalSnapshotForCurrentData,
    loadInvoiceFromHistory
  };
};
