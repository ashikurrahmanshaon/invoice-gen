import { useState, useCallback, useMemo, useEffect } from 'react';
import type { EstimateData } from '../types/estimate';
import type { LineItem } from '../types/invoice';
import { calculateTotals, normalizeDecimalString } from '../utils/calculations';
import { loadHydratedData, clearDraftStorage } from '../utils/storage';
import { generateEstimateNumber } from '../utils/estimateNumber';
import type { Settings } from '../types/settings';

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

export const defaultEstimate: EstimateData = {
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
    estimateNumber: generateEstimateNumber(),
    issueDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
  notes: 'This estimate is provided in good faith based on the current project scope. Final pricing may change if the scope, materials, labor, or project requirements change.',
  terms: '',
  signatureUrl: null
};

export const STORAGE_KEY_QUOTE_DRAFT = 'estimate_gen_data';
export const STORAGE_KEY_QUOTE_ACTIVE_HISTORY_ID = 'estimate_gen_active_history_id';
export const STORAGE_KEY_QUOTE_ORIGINAL_SNAPSHOT = 'estimate_gen_original_snapshot';

export const useEstimate = (initialSettings?: Settings) => {
  const [data, setData] = useState<EstimateData>(() => {
    const defaultWithSettings = {
      ...defaultEstimate,
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
      } : defaultEstimate.business,
      details: { 
        ...defaultEstimate.details, 
        currency: initialSettings?.invoiceDefaults.defaultCurrency || 'USD',
        themeColor: initialSettings?.brandKit.primaryColor || '#155EEF'
      },
      totals: { 
        ...defaultEstimate.totals, 
        taxLabel: initialSettings?.invoiceDefaults.defaultTaxLabel || 'Tax'
      }
    };

    const hydrated = loadHydratedData<EstimateData>(defaultWithSettings, STORAGE_KEY_QUOTE_DRAFT);
    
    // Ensure nested fields are safe
    if (!hydrated.business) hydrated.business = defaultWithSettings.business;
    if (!hydrated.client) hydrated.client = defaultWithSettings.client;
    if (!hydrated.details) hydrated.details = defaultWithSettings.details;
    
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

  const [selectedSavedVendorId, setSelectedSavedVendorId] = useState<string | null>(null);

  const [loadedHistoryId, setLoadedHistoryId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY_QUOTE_ACTIVE_HISTORY_ID) || null;
  });

  const [originalSnapshot, setOriginalSnapshot] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY_QUOTE_ORIGINAL_SNAPSHOT) || null;
  });

  const isDirty = useMemo(() => {
    if (originalSnapshot === null) return true;
    return JSON.stringify(data) !== originalSnapshot;
  }, [data, originalSnapshot]);

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

  const setOriginalSnapshotForCurrentData = useCallback((newData: EstimateData, newHistoryId: string | null) => {
    const snapshot = JSON.stringify(newData);
    setOriginalSnapshot(snapshot);
    setLoadedHistoryId(newHistoryId);
    try {
      localStorage.setItem(STORAGE_KEY_QUOTE_ORIGINAL_SNAPSHOT, snapshot);
      if (newHistoryId) {
        localStorage.setItem(STORAGE_KEY_QUOTE_ACTIVE_HISTORY_ID, newHistoryId);
      } else {
        localStorage.removeItem(STORAGE_KEY_QUOTE_ACTIVE_HISTORY_ID);
      }
    } catch (e) {
      console.error('Failed to save snapshot metadata', e);
    }
  }, []);

  const loadEstimateFromHistory = useCallback((historyId: string, historyData: EstimateData) => {
    setData(historyData);
    setOriginalSnapshotForCurrentData(historyData, historyId);
  }, [setOriginalSnapshotForCurrentData]);

  const updateBusiness = useCallback((business: Partial<EstimateData['business']>) => {
    setData(prev => ({ ...prev, business: { ...prev.business, ...business } }));
  }, []);

  const updateClient = useCallback((client: Partial<EstimateData['client']>) => {
    setData(prev => ({ ...prev, client: { ...prev.client, ...client } }));
  }, []);

  const updateDetails = useCallback((details: Partial<EstimateData['details']>) => {
    setData(prev => ({ ...prev, details: { ...prev.details, ...details } }));
  }, []);

  const updateOtherFields = useCallback((updates: Partial<EstimateData['totals']>) => {
    setData(prev => ({ ...prev, totals: { ...prev.totals, ...updates } }));
  }, []);

  const setDiscount = useCallback((value: string | number, type: 'percent' | 'flat') => {
    setData(prev => ({ ...prev, totals: { ...prev.totals, discountValue: value, discountType: type } }));
  }, []);

  const setTaxRate = useCallback((taxRate: string | number) => {
    setData(prev => ({ ...prev, totals: { ...prev.totals, taxRate } }));
  }, []);

  const setTaxLabel = useCallback((taxLabel: string) => {
    setData(prev => ({ ...prev, totals: { ...prev.totals, taxLabel } }));
  }, []);

  const setShipping = useCallback((shipping: string | number) => {
    setData(prev => ({ ...prev, totals: { ...prev.totals, shipping } }));
  }, []);

  const setAmountPaid = useCallback((amountPaid: string | number) => {
    setData(prev => ({ ...prev, totals: { ...prev.totals, amountPaid } }));
  }, []);

  const addItem = useCallback(() => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, createDefaultLineItem()]
    }));
  }, []);

  const updateItem = useCallback((id: string, itemUpdate: Partial<LineItem>) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, ...itemUpdate } : item)
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  }, []);

  const duplicateItem = useCallback((id: string) => {
    setData(prev => {
      const itemToDuplicate = prev.items.find(item => item.id === id);
      if (!itemToDuplicate) return prev;
      
      const newItem = { ...itemToDuplicate, id: generateId() };
      const itemIndex = prev.items.findIndex(item => item.id === id);
      
      const newItems = [...prev.items];
      newItems.splice(itemIndex + 1, 0, newItem);
      
      return { ...prev, items: newItems };
    });
  }, []);

  const reorderItems = useCallback((startIndex: number, endIndex: number) => {
    setData(prev => {
      const newItems = Array.from(prev.items);
      const [removed] = newItems.splice(startIndex, 1);
      newItems.splice(endIndex, 0, removed);
      return { ...prev, items: newItems };
    });
  }, []);

  const updateTotals = useCallback((totalsUpdate: Partial<EstimateData['totals']>) => {
    setData(prev => ({ ...prev, totals: { ...prev.totals, ...totalsUpdate } }));
  }, []);

  const updateNotes = useCallback((notes: string) => {
    setData(prev => ({ ...prev, notes }));
  }, []);

  const updateTerms = useCallback((terms: string) => {
    setData(prev => ({ ...prev, terms }));
  }, []);

  const updateSignatureUrl = useCallback((signatureUrl: string | null) => {
    setData(prev => ({ ...prev, signatureUrl }));
  }, []);

  const resetData = useCallback((skipSequenceReset?: boolean) => {
    clearDraftStorage(STORAGE_KEY_QUOTE_DRAFT);
    try {
      localStorage.removeItem(STORAGE_KEY_QUOTE_ACTIVE_HISTORY_ID);
      localStorage.removeItem(STORAGE_KEY_QUOTE_ORIGINAL_SNAPSHOT);
    } catch(_e){}
    setLoadedHistoryId(null);
    setOriginalSnapshot(null);

    setData({
      ...defaultEstimate,
      details: {
        ...defaultEstimate.details,
        estimateNumber: skipSequenceReset ? defaultEstimate.details.estimateNumber : generateEstimateNumber()
      }
    });
  }, []);

  const generateNewEstimate = useCallback(() => {
    clearDraftStorage(STORAGE_KEY_QUOTE_DRAFT);
    try {
      localStorage.removeItem(STORAGE_KEY_QUOTE_ACTIVE_HISTORY_ID);
      localStorage.removeItem(STORAGE_KEY_QUOTE_ORIGINAL_SNAPSHOT);
    } catch(_e){}
    
    setData(prev => {
      const newData = {
        ...defaultEstimate,
        business: prev.business, 
        details: {
          ...defaultEstimate.details,
          currency: prev.details.currency,
          estimateNumber: generateEstimateNumber()
        }
      };
      setOriginalSnapshot(null);
      setLoadedHistoryId(null);
      return newData;
    });
  }, []);

  const startNewRevision = useCallback(() => {
    const newPoNum = generateEstimateNumber();
    setData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        estimateNumber: newPoNum
      }
    }));
    try {
      localStorage.removeItem(STORAGE_KEY_QUOTE_ACTIVE_HISTORY_ID);
      localStorage.removeItem(STORAGE_KEY_QUOTE_ORIGINAL_SNAPSHOT);
    } catch(_e){}
    setLoadedHistoryId(null);
    setOriginalSnapshot(null);
  }, []);

  useEffect(() => {
    setData(prev => {
      const newTotals = calculateTotals(
        prev.items,
        prev.totals.discountValue,
        prev.totals.discountType,
        prev.totals.taxRate,
        prev.totals.taxLabel,
        prev.totals.shipping,
        prev.totals.amountPaid
      );
      
      const isDifferent = 
        newTotals.subtotal !== prev.totals.subtotal ||
        newTotals.discountAmount !== prev.totals.discountAmount ||
        newTotals.taxAmount !== prev.totals.taxAmount ||
        newTotals.total !== prev.totals.total ||
        newTotals.balanceDue !== prev.totals.balanceDue;

      if (!isDifferent) return prev;

      return {
        ...prev,
        totals: {
          ...prev.totals,
          ...newTotals
        }
      };
    });
  }, [
    data.items, 
    data.totals.discountValue, 
    data.totals.discountType, 
    data.totals.taxRate, 
    data.totals.shipping, 
    data.totals.amountPaid
  ]);

  return {
    data,
    updateBusiness,
    updateClient,
    updateDetails,
    updateOtherFields,
    setDiscount,
    setTaxRate,
    setTaxLabel,
    setShipping,
    setAmountPaid,
    addItem,
    updateItem,
    removeItem,
    duplicateItem,
    reorderItems,
    updateTotals,
    updateNotes,
    updateTerms,
    updateSignatureUrl,
    resetData,
    resetEverything: resetData,
    generateNewEstimate,
    startNewRevision,
    selectedSavedClientId: selectedSavedVendorId,
    setSelectedSavedClientId: setSelectedSavedVendorId,
    loadedHistoryId,
    loadInvoiceFromHistory: loadEstimateFromHistory,
    setOriginalSnapshotForCurrentData,
    isDirty
  };
};
