import type { InvoiceData, InvoiceDraftData, ProfileData, SavedClient } from '../types/invoice';

const isBrowser = typeof window !== 'undefined';
const safeLocalStorage = {
  getItem: (k: string): string | null => isBrowser ? window.localStorage.getItem(k) : null,
  setItem: (k: string, v: string): void => { if (isBrowser) window.localStorage.setItem(k, v); },
  removeItem: (k: string): void => { if (isBrowser) window.localStorage.removeItem(k); }
};

export const STORAGE_KEY_DRAFT = 'invoice_gen_data';
export const STORAGE_KEY_PROFILE = 'invoice_gen_profile';
export const STORAGE_KEY_HISTORY = 'invoice_gen_history';
export const STORAGE_KEY_PO_HISTORY = 'po_gen_history';
export const STORAGE_KEY_CLIENTS = 'invoice_gen_clients';

export const loadProfile = (): ProfileData | null => {
  try {
    const serializedData = safeLocalStorage.getItem(STORAGE_KEY_PROFILE);
    if (serializedData) {
      return JSON.parse(serializedData) as ProfileData;
    }
  } catch (error) {
    console.error('Failed to load profile from local storage', error);
  }
  return null;
};

export const loadDraft = (draftKey: string = STORAGE_KEY_DRAFT): InvoiceDraftData | null => {
  try {
    const serializedData = safeLocalStorage.getItem(draftKey);
    if (serializedData) {
      return JSON.parse(serializedData) as InvoiceDraftData;
    }
  } catch (error) {
    console.error(`Failed to load draft from local storage using key ${draftKey}`, error);
  }
  return null;
};

export const loadClients = (): SavedClient[] => {
  try {
    const serializedData = safeLocalStorage.getItem(STORAGE_KEY_CLIENTS);
    if (serializedData) {
      const parsed = JSON.parse(serializedData);
      if (Array.isArray(parsed)) {
        return parsed as SavedClient[];
      }
    }
  } catch (error) {
    console.error('Failed to load clients from local storage', error);
  }
  return [];
};

export const saveClients = (clients: SavedClient[]): { success: boolean; status: string } => {
  try {
    safeLocalStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
    return { success: true, status: 'success' };
  } catch (error) {
    console.error('Failed to save clients to local storage', error);
    return { success: false, status: 'error_clients' };
  }
};

const isProfileEqual = (p1: ProfileData, p2: ProfileData | null) => {
  if (!p2) return false;
  return JSON.stringify(p1) === JSON.stringify(p2);
};

export const saveToStorage = (data: InvoiceData | any, draftKey: string = STORAGE_KEY_DRAFT): { draftSuccess: boolean; profileSuccess: boolean } => {
  const { business, ...draftData } = data;
  const newProfile: ProfileData = {
    business,
    currency: data.details.currency
  };

  let draftSuccess = false;
  let profileSuccess = false;

  // Save Draft
  try {
    safeLocalStorage.setItem(draftKey, JSON.stringify(draftData));
    draftSuccess = true;
  } catch (error) {
    console.error(`Failed to save draft to local storage using key ${draftKey}`, error);
  }

  // Save Profile (only if changed or if profile doesn't exist)
  try {
    const currentProfile = loadProfile();
    if (!isProfileEqual(newProfile, currentProfile)) {
      safeLocalStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    }
    profileSuccess = true; // Still counts as success if we skipped unnecessary save
  } catch (error) {
    console.error('Failed to save profile to local storage', error);
  }

  return { draftSuccess, profileSuccess };
};

export const clearDraftStorage = (draftKey: string = STORAGE_KEY_DRAFT): void => {
  try {
    safeLocalStorage.removeItem(draftKey);
  } catch (error) {
    console.error(`Failed to clear draft storage for key ${draftKey}`, error);
  }
};

export const clearAllStorage = (): void => {
  try {
    safeLocalStorage.removeItem(STORAGE_KEY_DRAFT);
    safeLocalStorage.removeItem(STORAGE_KEY_PROFILE);
    safeLocalStorage.removeItem(STORAGE_KEY_CLIENTS);
  } catch (error) {
    console.error('Failed to clear all storage', error);
  }
};

export const loadHydratedData = <T extends object>(defaultData: T, draftKey: string = STORAGE_KEY_DRAFT): T => {
  const profile = loadProfile();
  
  let draft: any = null;
  try {
    const serializedData = safeLocalStorage.getItem(draftKey);
    if (serializedData) {
      draft = JSON.parse(serializedData);
    }
  } catch (e) {
    console.error(`Failed to load draft for key ${draftKey}`, e);
  }

  let finalProfile = profile;

  // 1. Migration: Legacy draft with valid business data, but no profile yet
  if (!profile && draft && draft.business) {
    finalProfile = {
      business: draft.business,
      currency: draft.details?.currency || 'USD'
    };
    try {
      safeLocalStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(finalProfile));
    } catch (e) {
      console.error('Migration profile save failed', e);
    }
  }

  // 2. Hydration
  if (draft) {
    return {
      ...defaultData,
      ...draft,
      details: {
        ...(defaultData as any).details,
        ...(draft.details || {}),
      },
      business: finalProfile?.business || (defaultData as any).business
    };
  }

  // 3. No active draft. Create a new one using profile defaults.
  if (finalProfile) {
    return {
      ...defaultData,
      business: finalProfile.business,
      details: {
        ...(defaultData as any).details,
        currency: finalProfile.currency || 'USD'
      }
    };
  }

  // 4. Pure default
  return defaultData;
};
