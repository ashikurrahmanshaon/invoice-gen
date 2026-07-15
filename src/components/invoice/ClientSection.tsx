import React, { useState } from 'react';
import { Building2, Mail, Phone, FileText, MapPin } from 'lucide-react';
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
    <div className="flex-col gap-6" style={{ width: '100%', marginBottom: '16px' }}>
      
      {/* Section Label */}
      <div className="section-label">Client Info</div>

      <div style={{ width: '100%' }}>
        <ClientPicker 
          clients={clientHook.clients} 
          onSelect={handleSelectSavedClient} 
          onDeleteRequest={(c) => setClientToDelete(c)} 
        />
        
        <div className="flex-col gap-4" style={{ marginTop: '16px' }}>
          <div className="grid-2">
            <Input 
              id="client-name-input"
              label="Client's business name"
              type="text" 
              placeholder="E.g. Global Trade LLC"
              value={data.client.name}
              onChange={(e) => updateClient({ name: e.target.value })}
              leftIcon={<Building2 size={16} />}
            />
            <Input 
              id="client-email-input"
              label="Client's email"
              type="email" 
              placeholder="client@email.com"
              value={data.client.email}
              onChange={(e) => updateClient({ email: e.target.value })}
              leftIcon={<Mail size={16} />}
            />
          </div>

          <div className="grid-2">
            <Input 
              id="client-phone-input"
              label="Phone Number"
              type="tel" 
              placeholder="+1 987 654 321"
              value={data.client.phone || ''}
              onChange={(e) => updateClient({ phone: e.target.value })}
              leftIcon={<Phone size={16} />}
            />
            <Input 
              id="client-taxid-input"
              label="Tax ID (optional)"
              type="text" 
              placeholder="E.g. XY9876543"
              value={data.client.taxId || ''}
              onChange={(e) => updateClient({ taxId: e.target.value })}
              leftIcon={<FileText size={16} />}
            />
          </div>

          <Input 
            id="client-address1-input"
            label="Address"
            type="text" 
            placeholder="456 Client Ave, City, Country"
            value={data.client.address1 || ''}
            onChange={(e) => updateClient({ address1: e.target.value })}
            leftIcon={<MapPin size={16} />}
          />
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
