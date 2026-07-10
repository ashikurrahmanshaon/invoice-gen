import { useState, useEffect, useCallback } from 'react';
import type { ClientDetails, SavedClient } from '../types/invoice';
import { loadClients, saveClients } from '../utils/storage';

export type SaveClientResult = 
  | { status: 'created'; client: SavedClient }
  | { status: 'duplicate_found'; duplicateId: string }
  | { status: 'updated'; client: SavedClient };

const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

const normalizeString = (str?: string) => (str || '').trim();
const normalizeCompare = (str?: string) => normalizeString(str).toLowerCase();

export const useClients = () => {
  const [clients, setClients] = useState<SavedClient[]>([]);

  useEffect(() => {
    setClients(loadClients().sort((a, b) => b.lastUsed - a.lastUsed));
  }, []);

  const findDuplicate = useCallback((details: ClientDetails, excludeId?: string) => {
    const email = normalizeCompare(details.email);
    const name = normalizeCompare(details.name);
    const phone = normalizeCompare(details.phone);

    return clients.find(c => {
      if (excludeId && c.id === excludeId) return false;
      
      const cEmail = normalizeCompare(c.email);
      if (email && cEmail && email === cEmail) {
        return true;
      }
      
      // Fallback if emails are empty
      if (!email && !cEmail) {
        const cName = normalizeCompare(c.name);
        const cPhone = normalizeCompare(c.phone);
        if (name === cName && phone === cPhone) {
          return true;
        }
      }
      
      return false;
    });
  }, [clients]);

  const saveClient = useCallback((details: ClientDetails): SaveClientResult => {
    // 1. Normalize fields (trim whitespace)
    const normalizedDetails: ClientDetails = {
      name: normalizeString(details.name),
      email: normalizeString(details.email),
      phone: normalizeString(details.phone),
      taxId: normalizeString(details.taxId),
      address1: normalizeString(details.address1),
      address2: normalizeString(details.address2),
      city: normalizeString(details.city),
      state: normalizeString(details.state),
      postalCode: normalizeString(details.postalCode),
      country: normalizeString(details.country)
    };

    // 2. Check for duplicates
    const duplicate = findDuplicate(normalizedDetails);
    if (duplicate) {
      return { status: 'duplicate_found', duplicateId: duplicate.id };
    }

    // 3. Create new
    const newClient: SavedClient = {
      ...normalizedDetails,
      id: generateId(),
      lastUsed: Date.now()
    };

    const newClients = [newClient, ...clients].sort((a, b) => b.lastUsed - a.lastUsed);
    setClients(newClients);
    saveClients(newClients);

    return { status: 'created', client: newClient };
  }, [clients, findDuplicate]);

  const forceUpdateClient = useCallback((id: string, details: ClientDetails): SaveClientResult => {
    const normalizedDetails: ClientDetails = {
      name: normalizeString(details.name),
      email: normalizeString(details.email),
      phone: normalizeString(details.phone),
      taxId: normalizeString(details.taxId),
      address1: normalizeString(details.address1),
      address2: normalizeString(details.address2),
      city: normalizeString(details.city),
      state: normalizeString(details.state),
      postalCode: normalizeString(details.postalCode),
      country: normalizeString(details.country)
    };

    // Note: If we are force updating, we could still accidentally create a duplicate of ANOTHER client.
    // E.g., changing Client A's email to Client B's email.
    const duplicate = findDuplicate(normalizedDetails, id);
    if (duplicate) {
      return { status: 'duplicate_found', duplicateId: duplicate.id };
    }

    let updatedClient: SavedClient | null = null;
    const newClients = clients.map(c => {
      if (c.id === id) {
        updatedClient = { ...c, ...normalizedDetails, lastUsed: Date.now() };
        return updatedClient;
      }
      return c;
    }).sort((a, b) => b.lastUsed - a.lastUsed);

    if (updatedClient) {
      setClients(newClients);
      saveClients(newClients);
      return { status: 'updated', client: updatedClient };
    }
    
    // Fallback if not found
    return saveClient(details);
  }, [clients, findDuplicate, saveClient]);

  const deleteClient = useCallback((id: string) => {
    const newClients = clients.filter(c => c.id !== id);
    setClients(newClients);
    saveClients(newClients);
  }, [clients]);

  const updateLastUsed = useCallback((id: string) => {
    const newClients = clients.map(c => {
      if (c.id === id) {
        return { ...c, lastUsed: Date.now() };
      }
      return c;
    }).sort((a, b) => b.lastUsed - a.lastUsed);
    
    setClients(newClients);
    // Explicitly isolated from invoice auto-save; errors silently
    saveClients(newClients);
  }, [clients]);

  return {
    clients,
    setClients, // to clear on Reset Everything
    saveClient,
    forceUpdateClient,
    deleteClient,
    updateLastUsed
  };
};
