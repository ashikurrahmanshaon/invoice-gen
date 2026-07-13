import React, { useState } from 'react';
import type { ClientDetails } from '../../types/invoice';
import type { useClients } from '../../hooks/useClients';

interface ClientActionsProps {
  clientDetails: ClientDetails;
  clientHook: ReturnType<typeof useClients>;
  selectedSavedClientId: string | null;
  setSelectedSavedClientId: (id: string | null) => void;
  onLoadClient?: (client: ClientDetails) => void;
}

export const ClientActions: React.FC<ClientActionsProps> = ({ 
  clientDetails, 
  clientHook, 
  selectedSavedClientId, 
  setSelectedSavedClientId,
  onLoadClient
}) => {
  const [duplicatePrompt, setDuplicatePrompt] = useState<string | null>(null);
  
  const savedClient = selectedSavedClientId ? clientHook.clients.find(c => c.id === selectedSavedClientId) : null;

  const isModified = savedClient && (
    (clientDetails.name || '').trim() !== (savedClient.name || '').trim() ||
    (clientDetails.email || '').trim() !== (savedClient.email || '').trim() ||
    (clientDetails.phone || '').trim() !== (savedClient.phone || '').trim() ||
    (clientDetails.taxId || '').trim() !== (savedClient.taxId || '').trim() ||
    (clientDetails.address1 || '').trim() !== (savedClient.address1 || '').trim() ||
    (clientDetails.address2 || '').trim() !== (savedClient.address2 || '').trim() ||
    (clientDetails.city || '').trim() !== (savedClient.city || '').trim() ||
    (clientDetails.state || '').trim() !== (savedClient.state || '').trim() ||
    (clientDetails.postalCode || '').trim() !== (savedClient.postalCode || '').trim() ||
    (clientDetails.country || '').trim() !== (savedClient.country || '').trim()
  );

  const hasData = !!((clientDetails.name || '').trim() || (clientDetails.email || '').trim());

  const handleSave = () => {
    const res = clientHook.saveClient(clientDetails);
    if (res.status === 'duplicate_found') {
      setDuplicatePrompt(res.duplicateId);
    } else if (res.status === 'created') {
      setSelectedSavedClientId(res.client.id);
    }
  };

  const handleForceUpdate = (id: string) => {
    const res = clientHook.forceUpdateClient(id, clientDetails);
    if (res.status === 'duplicate_found' && res.duplicateId !== id) {
      alert('Another client already uses this email. Cannot update.');
    } else if (res.status === 'updated' || res.status === 'created') {
      setSelectedSavedClientId(res.client.id);
      setDuplicatePrompt(null);
    }
  };

  const handleLoadDuplicate = (id: string) => {
    const dup = clientHook.clients.find(c => c.id === id);
    if (dup && onLoadClient) {
      onLoadClient(dup);
      setSelectedSavedClientId(dup.id);
      clientHook.updateLastUsed(dup.id);
    }
    setDuplicatePrompt(null);
  };

  if (duplicatePrompt) {
    const dupClient = clientHook.clients.find(c => c.id === duplicatePrompt);
    return (
      <div style={{ backgroundColor: 'var(--color-warning-light)', border: '1px solid var(--color-warning-border)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <span style={{ color: 'var(--color-warning-dark)' }}>
          Client <b>{dupClient?.name || dupClient?.email}</b> already exists.
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onLoadClient && (
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={() => handleLoadDuplicate(duplicatePrompt)}
            >
              Load Existing
            </button>
          )}
          <button 
            type="button" 
            className="btn btn-primary btn-sm" 
            onClick={() => handleForceUpdate(duplicatePrompt)}
          >
            Update Existing
          </button>
          <button 
            type="button" 
            className="btn btn-ghost btn-sm" 
            onClick={() => setDuplicatePrompt(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (selectedSavedClientId && isModified) {
    return (
      <div style={{ backgroundColor: 'var(--color-info-light)', border: '1px solid var(--color-info-border)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-3)' }}>
        <span style={{ color: 'var(--color-info-dark)' }}>
          Client modified.
        </span>
        <button 
          type="button" 
          className="btn btn-primary btn-sm" 
          onClick={() => handleForceUpdate(selectedSavedClientId)}
        >
          Update saved client
        </button>
      </div>
    );
  }

  if (!selectedSavedClientId && hasData) {
    return (
      <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          type="button" 
          className="btn btn-secondary btn-sm" 
          onClick={handleSave}
        >
          Save to clients
        </button>
      </div>
    );
  }

  return null;
};
