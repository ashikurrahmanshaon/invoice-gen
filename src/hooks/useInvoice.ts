import { useState, useCallback } from 'react';
import type { InvoiceData, LineItem } from '../types/invoice';
import { calculateTotals } from '../utils/calculations';
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

const normalizeDecimalString = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '' || trimmed === '.') return trimmed;
    const num = Number(trimmed);
    if (Number.isNaN(num) || !Number.isFinite(num)) return '';
    return trimmed;
  }
  if (typeof val === 'number') {
    if (Number.isNaN(val) || !Number.isFinite(val)) return '';
    return val === 0 ? '' : String(val);
  }
  return '';
};

export const STORAGE_KEY_ACTIVE_HISTORY_ID = 'invoice_gen_active_history_id';
export const STORAGE_KEY_ORIGINAL_SNAPSHOT = 'invoice_gen_original_snapshot';

export const useInvoice = () => {
  const [data, setData] = useState<InvoiceData>(() => {
    const hydrated = loadHydratedData(defaultInvoice);
    
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
    );

    return hydrated;
  });

  const [selectedSavedClientId, setSelectedSavedClientId] = useState<string | null>(null);

  const [loadedHistoryId, setLoadedHistoryId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_HISTORY_ID) || null;
  });

  const [originalSnapshot, setOriginalSnapshot] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_ORIGINAL_SNAPSHOT) || null;
  });

  // Calculate isDirty: if we have an original snapshot, compare it. 
  // If not, we are a new invoice. A new invoice is dirty if it differs from default values.
  // Actually, we can just initialize originalSnapshot on first load if null.
  
  // To avoid constant JSON.stringify, we do it inline.
  const currentSnapshot = JSON.stringify(data);
  const isDirty = originalSnapshot !== null ? currentSnapshot !== originalSnapshot : true;

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
      const newData = {
        ...defaultInvoice,
        business: prev.business, // Preserve Business Profile
        details: {
          ...defaultInvoice.details,
          invoiceNumber: generateInvoiceNumber(prev.details.invoiceNumber), // Guarantee distinct number
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          currency: prev.details.currency // Preserve Currency
        }
      };
      setOriginalSnapshotForCurrentData(newData, null);
      return newData;
    });
  }, [setOriginalSnapshotForCurrentData]);

  const resetEverything = useCallback((cancelPendingSave: () => void, clearHistory: boolean = false) => {
    cancelPendingSave(); // Cancel any pending auto-saves before destructive reset
    if (clearHistory) {
      clearAllStorage();
    } else {
      clearDraftStorage();
      // Only clear clients/profile, don't clear history
      localStorage.removeItem('invoice_gen_profile');
      localStorage.removeItem('invoice_gen_clients');
    }
    const freshData = {
      ...defaultInvoice,
      details: {
        ...defaultInvoice.details,
        invoiceNumber: generateInvoiceNumber() // Fresh number
      }
    };
    setOriginalSnapshotForCurrentData(freshData, null);
    setData(freshData);
  }, [setOriginalSnapshotForCurrentData]);

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
    removeItem,
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
