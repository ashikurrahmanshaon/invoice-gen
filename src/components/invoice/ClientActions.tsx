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
      <div style={{ backgroundColor: '#fff8e6', border: '1px solid #ffd57b', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
        <span style={{ color: '#8c6000' }}>
          Client <b>{dupClient?.name || dupClient?.email}</b> already exists.
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onLoadClient && (
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ padding: '4px 10px', fontSize: '12px' }}
              onClick={() => handleLoadDuplicate(duplicatePrompt)}
            >
              Load Existing
            </button>
          )}
          <button 
            type="button" 
            className="btn btn-primary" 
            style={{ padding: '4px 10px', fontSize: '12px' }}
            onClick={() => handleForceUpdate(duplicatePrompt)}
          >
            Update Existing
          </button>
          <button 
            type="button" 
            className="btn btn-ghost" 
            style={{ padding: '4px 10px', fontSize: '12px' }}
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
      <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <span style={{ color: '#0369a1' }}>
          Client modified.
        </span>
        <button 
          type="button" 
          className="btn btn-primary" 
          style={{ padding: '4px 10px', fontSize: '12px' }}
          onClick={() => handleForceUpdate(selectedSavedClientId)}
        >
          Update saved client
        </button>
      </div>
    );
  }

  if (!selectedSavedClientId && hasData) {
    return (
      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          type="button" 
          className="btn btn-secondary" 
          style={{ fontSize: '13px', padding: '6px 12px' }}
          onClick={handleSave}
        >
          Save to clients
        </button>
      </div>
    );
  }

  return null;
};
