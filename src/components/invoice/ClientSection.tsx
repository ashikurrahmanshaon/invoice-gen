import React, { useState } from 'react';
import { User, Building2, Mail, Phone, FileText, MapPin } from 'lucide-react';
import type { InvoiceData, ClientDetails, SavedClient } from '../../types/invoice';
import { ClientPicker } from './ClientPicker';
import { ClientActions } from './ClientActions';
import type { useClients } from '../../hooks/useClients';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import type { PurchaseOrderData } from '../../types/purchaseOrder';

interface ClientSectionProps {
  data: InvoiceData | PurchaseOrderData;
  updateClient: (updates: any) => void;
  clientHook: ReturnType<typeof useClients>;
  selectedSavedClientId: string | null;
  setSelectedSavedClientId: (id: string | null) => void;
  documentType?: 'invoice' | 'purchase_order';
}

const ClientSectionComponent: React.FC<ClientSectionProps> = ({ 
  data, updateClient, clientHook, selectedSavedClientId, setSelectedSavedClientId, documentType = 'invoice'
}) => {
  const isPO = documentType === 'purchase_order';
  const roleName = isPO ? 'Vendor' : 'Client';
  const contactData = isPO ? (data as PurchaseOrderData).vendor : (data as InvoiceData).client;
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
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        <div style={{ padding: '10px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '12px', display: 'flex' }}>
          <User size={20} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-title)', margin: 0, letterSpacing: '-0.3px' }}>{roleName} Details</h2>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Who is this {documentType === 'invoice' ? 'invoice' : 'document'} for?</span>
        </div>
      </div>

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
              label={`${roleName}'s business name`}
              type="text" 
              placeholder="E.g. Global Trade LLC"
              value={contactData.name}
              onChange={(e) => updateClient({ name: e.target.value })}
              leftIcon={<Building2 size={16} />}
            />
            <Input 
              id="client-email-input"
              label={`${roleName}'s email`}
              type="email" 
              inputMode="email"
              placeholder={`${roleName.toLowerCase()}@email.com`}
              value={contactData.email}
              onChange={(e) => updateClient({ email: e.target.value })}
              leftIcon={<Mail size={16} />}
            />
          </div>

          <div className="grid-2">
            <Input 
              id="client-phone-input"
              label={`${roleName}'s phone`}
              type="tel" 
              inputMode="tel"
              placeholder="+1 234 567 8900"
              value={contactData.phone || ''}
              onChange={(e) => updateClient({ phone: e.target.value })}
              leftIcon={<Phone size={16} />}
            />
            <Input 
              id="client-taxid-input"
              label="Tax ID (optional)"
              type="text" 
              placeholder="E.g. AB1234567"
              value={contactData.taxId || ''}
              onChange={(e) => updateClient({ taxId: e.target.value })}
              leftIcon={<FileText size={16} />}
            />
          </div>

          {/* Full Width Address */}
          <Input 
            id="client-address-input"
            label="Address"
            type="text" 
            placeholder={`123 ${roleName} Rd, City, Country`}
            value={contactData.address1 || ''}
            onChange={(e) => updateClient({ address1: e.target.value })}
            leftIcon={<MapPin size={16} />}
          />
        </div>
        
        <ClientActions 
          clientDetails={contactData} 
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
    return (
      (prevProps.documentType === 'purchase_order' 
        ? (prevProps.data as PurchaseOrderData).vendor === (nextProps.data as PurchaseOrderData).vendor 
        : (prevProps.data as InvoiceData).client === (nextProps.data as InvoiceData).client) &&
      prevProps.clientHook.clients === nextProps.clientHook.clients &&
      prevProps.selectedSavedClientId === nextProps.selectedSavedClientId &&
      prevProps.documentType === nextProps.documentType
    );
  }
);
