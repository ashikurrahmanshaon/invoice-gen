import { useState, useEffect, useCallback } from 'react';
import type { InvoiceData, SavedInvoice, InvoiceStatus } from '../types/invoice';
import { STORAGE_KEY_HISTORY } from '../utils/storage';

const generateId = () => crypto.randomUUID();

export const useHistory = () => {
  const [history, setHistory] = useState<SavedInvoice[]>([]);

  const loadHistory = useCallback(() => {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        if (Array.isArray(parsed)) {
          // Filter out any corrupted or incomplete items
          const validInvoices = parsed.filter(item => {
            return (
              item &&
              typeof item === 'object' &&
              typeof item.id === 'string' &&
              item.data &&
              typeof item.data === 'object' &&
              item.data.details &&
              typeof item.data.details === 'object' &&
              item.data.client &&
              typeof item.data.client === 'object' &&
              item.data.totals &&
              typeof item.data.totals === 'object'
            );
          });
          // Sort by issueDate descending, then createdAt descending
          const sorted = validInvoices.sort((a, b) => {
            const dateAStr = a?.data?.details?.issueDate || '';
            const dateBStr = b?.data?.details?.issueDate || '';
            const dateA = dateAStr ? new Date(dateAStr).getTime() : 0;
            const dateB = dateBStr ? new Date(dateBStr).getTime() : 0;
            if (dateA !== dateB) return dateB - dateA;
            return (b?.createdAt || 0) - (a?.createdAt || 0);
          });
          setHistory(sorted);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load history from local storage', error);
    }
    setHistory([]);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const checkDuplicateNumber = (invoiceNumber: string, excludeId: string | null): boolean => {
    return history.some(
      (inv) => inv?.data?.details?.invoiceNumber === invoiceNumber && inv?.id !== excludeId
    );
  };

  const saveToHistory = useCallback((
    data: InvoiceData,
    status: InvoiceStatus,
    existingId: string | null
  ): { success: boolean; error?: string; id?: string | null } => {
    if (checkDuplicateNumber(data.details.invoiceNumber, existingId)) {
      return { success: false, error: 'duplicate_number' };
    }

    try {
      const now = Date.now();
      let newHistory = [...history];
      let recordId = existingId;

      if (existingId) {
        const existingIndex = newHistory.findIndex((inv) => inv.id === existingId);
        if (existingIndex >= 0) {
          newHistory[existingIndex] = {
            ...newHistory[existingIndex],
            updatedAt: now,
            status,
            data: JSON.parse(JSON.stringify(data)), // Deep copy for immutable snapshot
          };
        } else {
          // Fallback if existingId not found (shouldn't happen, but just in case)
          recordId = generateId();
          newHistory.push({
            id: recordId,
            createdAt: now,
            updatedAt: now,
            status,
            schemaVersion: 1,
            data: JSON.parse(JSON.stringify(data)),
          });
        }
      } else {
        recordId = generateId();
        newHistory.push({
          id: recordId,
          createdAt: now,
          updatedAt: now,
          status,
          schemaVersion: 1,
          data: JSON.parse(JSON.stringify(data)),
        });
      }

      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistory));
      
      // Reload to ensure sorting is applied
      loadHistory();
      
      return { success: true, id: recordId };
    } catch (error) {
      console.error('Failed to save to history', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        return { success: false, error: 'quota_exceeded' };
      }
      return { success: false, error: 'unknown_error' };
    }
  }, [history, loadHistory]);

  const updateStatus = useCallback((id: string, status: InvoiceStatus): boolean => {
    try {
      let newHistory = [...history];
      const existingIndex = newHistory.findIndex((inv) => inv.id === id);
      if (existingIndex >= 0) {
        newHistory[existingIndex] = {
          ...newHistory[existingIndex],
          updatedAt: Date.now(),
          status,
        };
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistory));
        loadHistory();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update status', error);
      return false;
    }
  }, [history, loadHistory]);

  const deleteFromHistory = useCallback((id: string): boolean => {
    try {
      const newHistory = history.filter((inv) => inv.id !== id);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistory));
      setHistory(newHistory);
      return true;
    } catch (error) {
      console.error('Failed to delete from history', error);
      return false;
    }
  }, [history]);

  return {
    history,
    saveToHistory,
    updateStatus,
    deleteFromHistory,
    refreshHistory: loadHistory
  };
};
