import React, { useState } from 'react';
import { User } from 'lucide-react';
import type { InvoiceData, ClientDetails, SavedClient } from '../../types/invoice';
import { ClientPicker } from './ClientPicker';
import { ClientActions } from './ClientActions';
import type { useClients } from '../../hooks/useClients';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

interface ClientSectionProps {
  data: InvoiceData;
  updateClient: (updates: Partial<InvoiceData['client']>) => void;
  clientHook: ReturnType<typeof useClients>;
  selectedSavedClientId: string | null;
  setSelectedSavedClientId: (id: string | null) => void;
}

const ClientSectionComponent: React.FC<ClientSectionProps> = ({ 
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
    <div className="flex-col gap-6" style={{ width: '100%', paddingBottom: '32px', borderBottom: '1px solid #F1F5F9', marginBottom: '32px' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '8px' }}>
        <div style={{ padding: '8px', background: 'transparent' }}>
          <User size={24} color="#334155" />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B', margin: 0, marginTop: '2px' }}>Client Info</h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>Your client's information.</p>
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
            <Input 
              id="client-name-input"
              label="Client Name *"
              type="text" 
              placeholder="Client or Company Name"
              value={data.client.name}
              onChange={(e) => updateClient({ name: e.target.value })}
            />
            <Input 
              id="client-email-input"
              label="Email *"
              type="email" 
              placeholder="client@example.com"
              value={data.client.email}
              onChange={(e) => updateClient({ email: e.target.value })}
            />
          </div>

          {showOptional ? (
            <div className="flex-col gap-4" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              <div className="grid-2">
                <Input 
                  id="client-phone-input"
                  label="Phone"
                  type="tel" 
                  placeholder="Client phone number"
                  value={data.client.phone || ''}
                  onChange={(e) => updateClient({ phone: e.target.value })}
                />
                <Input 
                  id="client-taxid-input"
                  label="Tax ID / VAT Number"
                  type="text" 
                  placeholder="e.g. VAT / GST ID"
                  value={data.client.taxId || ''}
                  onChange={(e) => updateClient({ taxId: e.target.value })}
                />
              </div>

              <Input 
                id="client-address1-input"
                label="Address Line 1"
                type="text" 
                placeholder="Street address"
                value={data.client.address1 || ''}
                onChange={(e) => updateClient({ address1: e.target.value })}
              />
              
              <Input 
                id="client-address2-input"
                label="Address Line 2"
                type="text" 
                placeholder="Apt, suite, etc. (optional)"
                value={data.client.address2 || ''}
                onChange={(e) => updateClient({ address2: e.target.value })}
              />

              <div className="grid-2">
                <Input 
                  id="client-city-input"
                  label="City"
                  type="text" 
                  placeholder="City"
                  value={data.client.city || ''}
                  onChange={(e) => updateClient({ city: e.target.value })}
                />
                <Input 
                  id="client-state-input"
                  label="State / Province"
                  type="text" 
                  placeholder="State or Region"
                  value={data.client.state || ''}
                  onChange={(e) => updateClient({ state: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <Input 
                  id="client-postal-input"
                  label="Postal / ZIP Code"
                  type="text" 
                  placeholder="Postal code"
                  value={data.client.postalCode || ''}
                  onChange={(e) => updateClient({ postalCode: e.target.value })}
                />
                <Input 
                  id="client-country-input"
                  label="Country"
                  type="text" 
                  placeholder="Country"
                  value={data.client.country || ''}
                  onChange={(e) => updateClient({ country: e.target.value })}
                />
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

export const ClientSection = React.memo(
  ClientSectionComponent,
  (prevProps, nextProps) => {
    return prevProps.data.client === nextProps.data.client &&
           prevProps.selectedSavedClientId === nextProps.selectedSavedClientId &&
           prevProps.clientHook.clients === nextProps.clientHook.clients;
  }
);
