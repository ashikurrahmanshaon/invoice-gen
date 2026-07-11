import React, { useState } from 'react';
import type { InvoiceData, ClientDetails, SavedClient } from '../../types/invoice';
import { ClientPicker } from './ClientPicker';
import { ClientActions } from './ClientActions';
import type { useClients } from '../../hooks/useClients';
import { Modal } from '../ui/Modal';

interface ClientSectionProps {
  data: InvoiceData;
  updateClient: (updates: Partial<InvoiceData['client']>) => void;
  clientHook: ReturnType<typeof useClients>;
  selectedSavedClientId: string | null;
  setSelectedSavedClientId: (id: string | null) => void;
}

export const ClientSection: React.FC<ClientSectionProps> = ({ 
  data, updateClient, clientHook, selectedSavedClientId, setSelectedSavedClientId 
}) => {
  const [showOptional, setShowOptional] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<SavedClient | null>(null);

  const handleLoadClient = (client: ClientDetails) => {
    // deep copy client details so no IDs leak
    updateClient({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      taxId: client.taxId || '',
      address1: client.address1 || '',
      address2: client.address2 || '',
      city: client.city || '',
      state: client.state || '',
      postalCode: client.postalCode || '',
      country: client.country || '',
    });
  };

  const handleSelectSavedClient = (client: SavedClient) => {
    handleLoadClient(client);
    setSelectedSavedClientId(client.id);
    clientHook.updateLastUsed(client.id);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      clientHook.deleteClient(clientToDelete.id);
      if (selectedSavedClientId === clientToDelete.id) {
        setSelectedSavedClientId(null);
      }
      setClientToDelete(null);
    }
  };

  return (
    <div className="flex-col gap-6" style={{ width: '100%', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-6)' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
        <span className="step-badge">02</span>
        <div className="flex-col">
          <h3 className="font-bold text-base" style={{ lineHeight: 1.2, margin: 0, color: 'var(--color-text-main)' }}>Client details</h3>
          <span className="text-xs text-secondary">Who should receive this invoice?</span>
        </div>
      </div>

      <div style={{ width: '100%' }}>
        <ClientPicker 
          clients={clientHook.clients} 
          onSelect={handleSelectSavedClient} 
          onDeleteRequest={(c) => setClientToDelete(c)} 
        />
        
        <div className="flex-col gap-4">
          <div className="grid-2">
            <div>
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Client Name *</label>
              <input 
                type="text" 
                placeholder="Client or Company Name"
                value={data.client.name}
                onChange={(e) => updateClient({ name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Email *</label>
              <input 
                type="email" 
                placeholder="client@example.com"
                value={data.client.email}
                onChange={(e) => updateClient({ email: e.target.value })}
              />
            </div>
          </div>

          {showOptional ? (
            <div className="flex-col gap-3" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
              <div className="grid-2">
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Phone</label>
                  <input 
                    type="tel" 
                    placeholder="Client phone number"
                    value={data.client.phone || ''}
                    onChange={(e) => updateClient({ phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Tax ID / VAT Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. VAT / GST ID"
                    value={data.client.taxId || ''}
                    onChange={(e) => updateClient({ taxId: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Address Line 1</label>
                <input 
                  type="text" 
                  placeholder="Street address"
                  value={data.client.address1 || ''}
                  onChange={(e) => updateClient({ address1: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Address Line 2</label>
                <input 
                  type="text" 
                  placeholder="Apt, suite, etc. (optional)"
                  value={data.client.address2 || ''}
                  onChange={(e) => updateClient({ address2: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>City</label>
                  <input 
                    type="text" 
                    placeholder="City"
                    value={data.client.city || ''}
                    onChange={(e) => updateClient({ city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>State / Province</label>
                  <input 
                    type="text" 
                    placeholder="State or Region"
                    value={data.client.state || ''}
                    onChange={(e) => updateClient({ state: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Postal / ZIP Code</label>
                  <input 
                    type="text" 
                    placeholder="Postal code"
                    value={data.client.postalCode || ''}
                    onChange={(e) => updateClient({ postalCode: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Country</label>
                  <input 
                    type="text" 
                    placeholder="Country"
                    value={data.client.country || ''}
                    onChange={(e) => updateClient({ country: e.target.value })}
                  />
                </div>
              </div>

              <button 
                className="btn btn-ghost text-primary text-xs" 
                style={{ paddingLeft: 0, justifyContent: 'flex-start', alignSelf: 'flex-start', minHeight: 'auto', padding: '4px 0', marginTop: '4px' }}
                onClick={() => setShowOptional(false)}
              >
                − Hide additional client details
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-ghost text-primary text-xs" 
              style={{ paddingLeft: 0, justifyContent: 'flex-start', alignSelf: 'flex-start', minHeight: 'auto', padding: '4px 0' }}
              onClick={() => setShowOptional(true)}
            >
              + Add client details
            </button>
          )}
        </div>
        
        <ClientActions 
          clientDetails={data.client}
          clientHook={clientHook}
          selectedSavedClientId={selectedSavedClientId}
          setSelectedSavedClientId={setSelectedSavedClientId}
          onLoadClient={handleLoadClient}
        />
      </div>

      <Modal 
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        title="Delete Saved Client"
        message={`Are you sure you want to delete ${clientToDelete?.name || clientToDelete?.email || 'this client'} from your address book? This will NOT remove their details from your active invoice.`}
        type="danger"
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
