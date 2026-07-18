import { useEffect, useRef, useState } from 'react';
import type { InvoiceData } from '../types/invoice';
import { saveToStorage } from '../utils/storage';

export type SaveStatus = 'idle' | 'saving' | 'success' | 'error_draft' | 'error_profile';

export const useAutoSave = (data: InvoiceData | any, draftKey?: string) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  const lastSavedDataRef = useRef<string>('');

  useEffect(() => {
    const stringifiedData = JSON.stringify(data);
    if (stringifiedData === lastSavedDataRef.current) {
      return; // Skip save if data hasn't changed
    }

    setSaveStatus('saving');
    // Implementing debounce for auto save to prevent aggressive writing
    timerRef.current = setTimeout(() => {
      const { draftSuccess, profileSuccess } = saveToStorage(data, draftKey);
      if (draftSuccess && profileSuccess) {
        lastSavedDataRef.current = stringifiedData;
      }
      
      if (!draftSuccess) {
        setSaveStatus('error_draft');
      } else if (!profileSuccess) {
        setSaveStatus('error_profile');
      } else {
        setSaveStatus('success');
      }
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data, draftKey]);

  const cancelPendingSave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return { cancelPendingSave, saveStatus };
};
