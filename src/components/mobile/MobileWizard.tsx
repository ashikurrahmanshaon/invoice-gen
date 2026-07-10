import React, { useState } from 'react';
import type { InvoiceData, LineItem } from '../../types/invoice';
import { formatCurrency } from '../../utils/currency';
import { Trash2, Copy, Plus, ChevronUp } from 'lucide-react';
import { processImageFile } from '../../utils/image';
import { isValidDecimalInput, calculateLineAmount } from '../../utils/calculations';
import { ClientPicker } from '../invoice/ClientPicker';
import { ClientActions } from '../invoice/ClientActions';
import type { useClients } from '../../hooks/useClients';
import type { ClientDetails, SavedClient } from '../../types/invoice';
import { Modal } from '../ui/Modal';

interface MobileWizardProps {
  currentStage: number;
  setStage: (stage: number) => void;
  data: InvoiceData;
  updateBusiness: (updates: Partial<InvoiceData['business']>) => void;
  updateClient: (updates: Partial<InvoiceData['client']>) => void;
  clientHook: ReturnType<typeof useClients>;
  selectedSavedClientId: string | null;
  setSelectedSavedClientId: (id: string | null) => void;
  updateDetails: (updates: Partial<InvoiceData['details']>) => void;
  updateOtherFields: (updates: Partial<Pick<InvoiceData, 'notes' | 'terms' | 'paymentInstructions' | 'signatureUrl'>>) => void;
  addItem: () => void;
  duplicateItem: (id: string) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<LineItem>) => void;
  setDiscount: (value: number | string, type: 'percent' | 'flat') => void;
  setTaxRate: (rate: number | string) => void;
  setTaxLabel: (label: string) => void;
  setShipping: (amount: number | string) => void;
  setAmountPaid: (amount: number | string) => void;
  onDownloadPDF: () => void;
  onOpenFullPreview: () => void;
}

export const MobileWizard: React.FC<MobileWizardProps> = ({
  currentStage, setStage, data, updateBusiness, updateClient, clientHook, selectedSavedClientId, setSelectedSavedClientId, updateDetails,
  updateOtherFields, addItem, duplicateItem, removeItem, updateItem,
  setDiscount, setTaxRate, setTaxLabel, setShipping, setAmountPaid, onDownloadPDF, onOpenFullPreview
}) => {
  const [showOptionalBusiness, setShowOptionalBusiness] = useState(false);
  const [showOptionalClient, setShowOptionalClient] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<SavedClient | null>(null);

  const handleLoadClient = (client: ClientDetails) => {
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

  const [showTerms, setShowTerms] = useState(() => !!data.terms);
  const [showInstructions, setShowInstructions] = useState(() => !!data.paymentInstructions);

  const [enableDiscount, setEnableDiscount] = useState(() => Number(data.totals.discountValue) > 0 || Number(data.totals.discountAmount) > 0);
  const [enableTax, setEnableTax] = useState(() => Number(data.totals.taxRate) > 0 || Number(data.totals.taxAmount) > 0);
  const [enableShipping, setEnableShipping] = useState(() => Number(data.totals.shipping) > 0);

  const { currency } = data.details;
  const { totals } = data;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const logoUrl = await processImageFile(file);
        updateBusiness({ logoUrl });
      } catch (error) {
        console.error('Error processing logo:', error);
      }
    }
  };

  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const symbol = getCurrencySymbol(currency);

  return (
    <div className="mobile-only mobile-step-container" style={{ width: '100%', minWidth: 0, paddingBottom: '140px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* STEP 1 — BUSINESS */}
      {currentStage === 1 && (
        <div className="flex-col gap-5" style={{ width: '100%' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-main)', margin: 0 }}>Business details</h2>
            <p className="text-xs text-secondary" style={{ margin: 0 }}>Add the information shown on your invoice.</p>
          </div>
          
          <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Business Name */}
            <div>
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Business Name *</label>
              <input 
                type="text" 
                placeholder="Your Business Name"
                value={data.business.name}
                onChange={(e) => updateBusiness({ name: e.target.value })}
                style={{ fontSize: '16px', height: '48px' }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Email *</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                value={data.business.email}
                onChange={(e) => updateBusiness({ email: e.target.value })}
                style={{ fontSize: '16px', height: '48px' }}
              />
            </div>

            {/* Logo Upload (100% width, 96px height) */}
            <div>
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Business Logo</label>
              {data.business.logoUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={data.business.logoUrl} alt="Logo" style={{ width: '120px', height: '96px', objectFit: 'contain', border: '1px solid #EAECF0', borderRadius: '8px' }} />
                  <button className="btn btn-outline text-xs" style={{ minHeight: '36px', height: '36px', padding: '0 12px' }} onClick={() => updateBusiness({ logoUrl: null })}>Remove</button>
                </div>
              ) : (
                <label style={{
                  width: '100%',
                  height: '96px',
                  border: '1px dashed #D0D5DD',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  background: '#FFFFFF',
                  color: 'var(--color-text-secondary)'
                }}>
                  <Plus size={20} className="text-secondary" />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Add logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                </label>
              )}
            </div>

            {/* Invoice Number */}
            <div>
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Invoice Number</label>
              <input 
                type="text" 
                value={data.details.invoiceNumber}
                onChange={(e) => updateDetails({ invoiceNumber: e.target.value })}
                style={{ fontSize: '16px', height: '48px' }}
              />
            </div>

            {/* Issue Date */}
            <div>
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Issue Date</label>
              <input 
                type="date" 
                value={data.details.issueDate}
                onChange={(e) => updateDetails({ issueDate: e.target.value })}
                style={{ fontSize: '16px', height: '48px' }}
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Due Date</label>
              <input 
                type="date" 
                value={data.details.dueDate}
                onChange={(e) => updateDetails({ dueDate: e.target.value })}
                style={{ fontSize: '16px', height: '48px' }}
              />
            </div>

            {/* Currency */}
            <div>
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Currency</label>
              <select 
                value={data.details.currency}
                onChange={(e) => updateDetails({ currency: e.target.value })}
                style={{ fontSize: '16px', height: '48px' }}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            {/* Optional Fields Toggle */}
            {showOptionalBusiness ? (
              <div className="flex-col gap-4" style={{ borderTop: '1px solid #EAECF0', paddingTop: '16px' }}>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Phone</label>
                  <input 
                    type="tel" 
                    placeholder="Phone number"
                    value={data.business.phone || ''}
                    onChange={(e) => updateBusiness({ phone: e.target.value })}
                    style={{ fontSize: '16px', height: '48px' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Website</label>
                  <input 
                    type="url" 
                    placeholder="e.g. www.website.com"
                    value={data.business.website || ''}
                    onChange={(e) => updateBusiness({ website: e.target.value })}
                    style={{ fontSize: '16px', height: '48px' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Address Line 1</label>
                  <input 
                    type="text" 
                    placeholder="Street address"
                    value={data.business.address1 || ''}
                    onChange={(e) => updateBusiness({ address1: e.target.value })}
                    style={{ fontSize: '16px', height: '48px' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Address Line 2</label>
                  <input 
                    type="text" 
                    placeholder="Apt, suite, etc. (optional)"
                    value={data.business.address2 || ''}
                    onChange={(e) => updateBusiness({ address2: e.target.value })}
                    style={{ fontSize: '16px', height: '48px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>City</label>
                    <input 
                      type="text" 
                      placeholder="City"
                      value={data.business.city || ''}
                      onChange={(e) => updateBusiness({ city: e.target.value })}
                      style={{ fontSize: '16px', height: '48px', width: '100%' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>State / Province</label>
                    <input 
                      type="text" 
                      placeholder="State or Region"
                      value={data.business.state || ''}
                      onChange={(e) => updateBusiness({ state: e.target.value })}
                      style={{ fontSize: '16px', height: '48px', width: '100%' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Postal Code</label>
                    <input 
                      type="text" 
                      placeholder="Postal code"
                      value={data.business.postalCode || ''}
                      onChange={(e) => updateBusiness({ postalCode: e.target.value })}
                      style={{ fontSize: '16px', height: '48px', width: '100%' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Country</label>
                    <input 
                      type="text" 
                      placeholder="Country"
                      value={data.business.country || ''}
                      onChange={(e) => updateBusiness({ country: e.target.value })}
                      style={{ fontSize: '16px', height: '48px', width: '100%' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Tax ID / VAT Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. VAT / GST ID"
                    value={data.business.taxId || ''}
                    onChange={(e) => updateBusiness({ taxId: e.target.value })}
                    style={{ fontSize: '16px', height: '48px' }}
                  />
                </div>
                <button 
                  className="btn btn-ghost text-primary text-xs" 
                  style={{ paddingLeft: 0, justifyContent: 'flex-start', alignSelf: 'flex-start', minHeight: 'auto', padding: '4px 0', marginTop: '4px' }}
                  onClick={() => setShowOptionalBusiness(false)}
                >
                  − Hide additional business details
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-ghost text-primary text-xs" 
                style={{ paddingLeft: 0, justifyContent: 'flex-start', alignSelf: 'flex-start', minHeight: 'auto', padding: '4px 0' }}
                onClick={() => setShowOptionalBusiness(true)}
              >
                + Add more business details
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 2 — CLIENT */}
      {currentStage === 2 && (
        <div className="flex-col gap-5" style={{ width: '100%' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-main)', margin: 0 }}>Client details</h2>
            <p className="text-xs text-secondary" style={{ margin: 0 }}>Who should receive this invoice?</p>
          </div>
          
          <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ClientPicker 
              clients={clientHook.clients} 
              onSelect={handleSelectSavedClient} 
              onDeleteRequest={(c) => setClientToDelete(c)} 
            />
            
            <div>
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Client Name *</label>
              <input 
                type="text" 
                placeholder="Client or Company Name"
                value={data.client.name}
                onChange={(e) => updateClient({ name: e.target.value })}
                style={{ fontSize: '16px', height: '48px' }}
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Email *</label>
              <input 
                type="email" 
                placeholder="client@example.com"
                value={data.client.email}
                onChange={(e) => updateClient({ email: e.target.value })}
                style={{ fontSize: '16px', height: '48px' }}
              />
            </div>

            {/* Optional Client Details Toggle */}
            {showOptionalClient ? (
              <div className="flex-col gap-4" style={{ borderTop: '1px solid #EAECF0', paddingTop: '16px' }}>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Phone</label>
                  <input 
                    type="tel" 
                    placeholder="Client phone"
                    value={data.client.phone || ''}
                    onChange={(e) => updateClient({ phone: e.target.value })}
                    style={{ fontSize: '16px', height: '48px' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Address Line 1</label>
                  <input 
                    type="text" 
                    placeholder="Street address"
                    value={data.client.address1 || ''}
                    onChange={(e) => updateClient({ address1: e.target.value })}
                    style={{ fontSize: '16px', height: '48px' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Address Line 2</label>
                  <input 
                    type="text" 
                    placeholder="Apt, suite, etc. (optional)"
                    value={data.client.address2 || ''}
                    onChange={(e) => updateClient({ address2: e.target.value })}
                    style={{ fontSize: '16px', height: '48px' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>City</label>
                    <input 
                      type="text" 
                      placeholder="City"
                      value={data.client.city || ''}
                      onChange={(e) => updateClient({ city: e.target.value })}
                      style={{ fontSize: '16px', height: '48px' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>State / Province</label>
                    <input 
                      type="text" 
                      placeholder="State"
                      value={data.client.state || ''}
                      onChange={(e) => updateClient({ state: e.target.value })}
                      style={{ fontSize: '16px', height: '48px' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Postal / ZIP Code</label>
                    <input 
                      type="text" 
                      placeholder="Postal code"
                      value={data.client.postalCode || ''}
                      onChange={(e) => updateClient({ postalCode: e.target.value })}
                      style={{ fontSize: '16px', height: '48px' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Country</label>
                    <input 
                      type="text" 
                      placeholder="Country"
                      value={data.client.country || ''}
                      onChange={(e) => updateClient({ country: e.target.value })}
                      style={{ fontSize: '16px', height: '48px' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Tax ID / VAT Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. VAT / GST ID"
                    value={data.client.taxId || ''}
                    onChange={(e) => updateClient({ taxId: e.target.value })}
                    style={{ fontSize: '16px', height: '48px' }}
                  />
                </div>
                <button 
                  className="btn btn-ghost text-primary text-xs" 
                  style={{ paddingLeft: 0, justifyContent: 'flex-start', alignSelf: 'flex-start', minHeight: 'auto', padding: '4px 0', marginTop: '4px' }}
                  onClick={() => setShowOptionalClient(false)}
                >
                  − Hide additional client details
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-ghost text-primary text-xs" 
                style={{ paddingLeft: 0, justifyContent: 'flex-start', alignSelf: 'flex-start', minHeight: 'auto', padding: '4px 0' }}
                onClick={() => setShowOptionalClient(true)}
              >
                + Add client details
              </button>
            )}
            
            <ClientActions 
              clientDetails={data.client}
              clientHook={clientHook}
              selectedSavedClientId={selectedSavedClientId}
              setSelectedSavedClientId={setSelectedSavedClientId}
              onLoadClient={handleLoadClient}
            />
          </div>
        </div>
      )}

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

      {/* STEP 3 — ITEMS */}
      {currentStage === 3 && (
        <div className="flex-col gap-5" style={{ width: '100%' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-main)', margin: 0 }}>Items</h2>
            <p className="text-xs text-secondary" style={{ margin: 0 }}>Add products or services.</p>
          </div>
          
          <div className="flex-col gap-4" style={{ width: '100%' }}>
            {data.items.map((item, index) => (
              <div key={item.id} style={{
                background: '#FFFFFF',
                border: '1px solid #EAECF0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: '100%',
                boxSizing: 'border-box'
              }} className="mobile-item-card">
                {/* Top Row: Item Label + Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text-main)' }}>Item {index + 1}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => duplicateItem(item.id)}
                      style={{ width: '44px', height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667085', background: 'none', border: 'none', padding: 0 }}
                      className="btn-action-dup"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      onClick={() => removeItem(item.id)}
                      style={{ width: '44px', height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D92D20', background: 'none', border: 'none', padding: 0 }}
                      className="btn-action-del"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Fields Stacked */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Item or service name"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    style={{ height: '46px', fontSize: '16px', padding: '0 12px' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Description (optional)"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    style={{ height: '46px', fontSize: '16px', padding: '0 12px' }}
                  />
                </div>

                {/* Second Row: Rate & Qty */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', width: '100%' }}>
                  {/* Rate */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Rate</label>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: 'var(--color-text-secondary)', pointerEvents: 'none' }}>{symbol}</span>
                      <input 
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={item.rate}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (isValidDecimalInput(val)) {
                            updateItem(item.id, { rate: val });
                          }
                        }}
                        style={{ height: '46px', fontSize: '16px', padding: '0 12px 0 24px', width: '100%' }}
                      />
                    </div>
                  </div>
                  {/* Qty */}
                  <div style={{ width: '88px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'center', display: 'block', width: '100%' }}>Qty</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      placeholder="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (isValidDecimalInput(val)) {
                          updateItem(item.id, { quantity: val });
                        }
                      }}
                      style={{ height: '46px', fontSize: '16px', padding: '0 8px', textAlign: 'center', width: '100%' }}
                    />
                  </div>
                </div>

                {/* Bottom Row: Amount */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #EAECF0' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Amount</span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    {formatCurrency(calculateLineAmount(item.rate, item.quantity), data.details.currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          <button 
            className="btn btn-outline text-primary" 
            style={{ width: '100%', minHeight: '44px', fontWeight: 500, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} 
            onClick={addItem}
          >
            <Plus size={16} /> Add another item
          </button>

          {/* Compact Running Subtotal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '8px', padding: '12px 16px', marginTop: '4px', marginBottom: '80px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Running Subtotal</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
              {formatCurrency(data.totals.subtotal, data.details.currency)}
            </span>
          </div>
        </div>
      )}

      {/* STEP 4 — REVIEW */}
      {currentStage === 4 && (
        <div className="flex-col gap-5" style={{ width: '100%', paddingBottom: '140px' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-main)', margin: 0 }}>Review & finish</h2>
            <p className="text-xs text-secondary" style={{ margin: 0 }}>Add notes and check the final amount.</p>
          </div>

          {/* Summary Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #EAECF0',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Summary</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Business:</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{data.business.name || 'Not added'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Client:</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{data.client.name || 'Not added'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Items:</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{data.items.length} {data.items.length === 1 ? 'item' : 'items'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #EAECF0', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Total:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(data.totals.total, data.details.currency)}</span>
              </div>
            </div>
          </div>

          {/* Notes Textarea */}
          <div>
            <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '8px' }}>Notes</label>
            <textarea 
              placeholder="Thank you for your business."
              value={data.notes}
              onChange={(e) => updateOtherFields({ notes: e.target.value })}
              style={{ height: '128px', maxHeight: '128px', resize: 'none', width: '100%', fontSize: '16px' }}
            />
          </div>

          {/* Optional Textareas (Terms & Instructions) */}
          {showTerms && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="text-xs font-semibold text-secondary">Terms & Conditions</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setShowTerms(false)}
                    style={{ color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                    title="Collapse"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button 
                    onClick={() => { setShowTerms(false); updateOtherFields({ terms: '' }); }}
                    style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                    className="hover-text-error"
                    title="Clear"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <textarea 
                placeholder="e.g. Payment is due within 14 days"
                value={data.terms || ''}
                onChange={(e) => updateOtherFields({ terms: e.target.value })}
                style={{ height: '80px', fontSize: '16px', width: '100%', resize: 'vertical', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
              />
            </div>
          )}

          {showInstructions && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="text-xs font-semibold text-secondary">Payment Instructions</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setShowInstructions(false)}
                    style={{ color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                    title="Collapse"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button 
                    onClick={() => { setShowInstructions(false); updateOtherFields({ paymentInstructions: '' }); }}
                    style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                    className="hover-text-error"
                    title="Clear"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <textarea 
                placeholder="e.g. Bank transfer details, PayPal email"
                value={data.paymentInstructions || ''}
                onChange={(e) => updateOtherFields({ paymentInstructions: e.target.value })}
                style={{ height: '80px', fontSize: '16px', width: '100%', resize: 'vertical', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
              />
            </div>
          )}

          {/* Secondary Toggles Row */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {!showTerms && (
              <button 
                className="btn btn-outline text-xs" 
                style={{ minHeight: '36px', height: '36px', padding: '0 12px', fontWeight: 500 }}
                onClick={() => setShowTerms(true)}
              >
                {data.terms ? 'Edit terms' : '+ Add terms'}
              </button>
            )}
            {!showInstructions && (
              <button 
                className="btn btn-outline text-xs" 
                style={{ minHeight: '36px', height: '36px', padding: '0 12px', fontWeight: 500 }}
                onClick={() => setShowInstructions(true)}
              >
                {data.paymentInstructions ? 'Edit instructions' : '+ Payment instructions'}
              </button>
            )}
          </div>

          {/* Mobile Totals Card (Same Grid Alignment as Desktop) */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E4E7EC',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Subtotal Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px', color: 'var(--color-text-main)', fontWeight: 500 }}>
              <span>Subtotal</span>
              <div></div>
              <div></div>
              <span style={{ textAlign: 'right' }}>{formatCurrency(totals.subtotal, currency)}</span>
            </div>

            {/* Discount Row */}
            {enableDiscount ? (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
                <span className="text-secondary">Discount</span>
                <div style={{ justifySelf: 'start', display: 'flex', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'white', overflow: 'hidden', height: '32px', width: '92px' }}>
                  <input 
                    type="text" 
                    value={totals.discountValue !== undefined ? totals.discountValue : ''}
                    onChange={(e) => {
                      if (isValidDecimalInput(e.target.value)) setDiscount(e.target.value, totals.discountType);
                    }}
                    style={{ border: 'none', padding: '0 6px', width: '100%', minWidth: 0, textAlign: 'right', minHeight: 'auto', height: '100%', fontSize: '12px', background: 'none', outline: 'none' }}
                    placeholder="0"
                  />
                  <select 
                    value={totals.discountType}
                    onChange={(e) => setDiscount(totals.discountValue, e.target.value as 'percent' | 'flat')}
                    style={{ border: 'none', borderLeft: '1px solid var(--color-border)', background: '#F8FAFC', fontSize: '11px', height: '100%', padding: '0 4px', width: '38px', minHeight: 'auto', borderRadius: 0, flexShrink: 0 }}
                  >
                    <option value="percent">%</option>
                    <option value="flat">{symbol}</option>
                  </select>
                </div>
                <button 
                  onClick={() => { setEnableDiscount(false); setDiscount(0, 'percent'); }} 
                  style={{ justifySelf: 'center', color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}
                  className="hover-text-error"
                >
                  <Trash2 size={14} />
                </button>
                <span className="font-medium text-secondary" style={{ textAlign: 'right' }}>
                  -{formatCurrency(totals.discountAmount, currency)}
                </span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px', height: '32px' }}>
                <span className="text-secondary">Discount</span>
                <button 
                  className="text-primary" 
                  style={{ justifySelf: 'start', padding: 0, minHeight: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                  onClick={() => setEnableDiscount(true)}
                >
                  + Add discount
                </button>
                <div></div>
                <div></div>
              </div>
            )}

            {/* Tax Row */}
            {enableTax ? (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
                <input 
                  type="text" 
                  className="text-secondary font-medium"
                  value={totals.taxLabel || ''}
                  onChange={(e) => setTaxLabel(e.target.value)}
                  onBlur={(e) => {
                    const trimmed = e.target.value.trim();
                    if (!trimmed) setTaxLabel('Tax');
                    else setTaxLabel(trimmed);
                  }}
                  maxLength={15}
                  placeholder="Tax"
                  style={{ border: '1px solid transparent', background: 'transparent', outline: 'none', padding: 0, margin: 0, width: '100%', fontSize: '14px' }}
                />
                <div style={{ justifySelf: 'start', display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'white', overflow: 'hidden', height: '32px', width: '92px' }}>
                  <input 
                    type="text" 
                    value={totals.taxRate !== undefined ? totals.taxRate : ''}
                    onChange={(e) => {
                      if (isValidDecimalInput(e.target.value)) setTaxRate(e.target.value);
                    }}
                    style={{ border: 'none', padding: '0 6px', width: '100%', minWidth: 0, textAlign: 'right', minHeight: 'auto', height: '100%', fontSize: '12px', background: 'none', outline: 'none' }}
                    placeholder="0"
                  />
                  <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', paddingRight: '8px', background: 'white', userSelect: 'none' }}>%</span>
                </div>
                <button 
                  onClick={() => { setEnableTax(false); setTaxRate(0); }} 
                  style={{ justifySelf: 'center', color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}
                  className="hover-text-error"
                >
                  <Trash2 size={14} />
                </button>
                <span className="font-medium text-secondary" style={{ textAlign: 'right' }}>
                  {formatCurrency(totals.taxAmount, currency)}
                </span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px', height: '32px' }}>
                <span className="text-secondary">Tax</span>
                <button 
                  className="text-primary" 
                  style={{ justifySelf: 'start', padding: 0, minHeight: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                  onClick={() => setEnableTax(true)}
                >
                  + Add tax
                </button>
                <div></div>
                <div></div>
              </div>
            )}

            {/* Shipping Row */}
            {enableShipping ? (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
                <span className="text-secondary">Shipping</span>
                <div style={{ justifySelf: 'start', position: 'relative', width: '92px', height: '32px' }}>
                  <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }}>{symbol}</span>
                  <input 
                    type="text" 
                    value={totals.shipping !== undefined ? totals.shipping : ''}
                    onChange={(e) => {
                      if (isValidDecimalInput(e.target.value)) setShipping(e.target.value);
                    }}
                    style={{ border: '1px solid var(--color-border)', padding: '0 6px 0 16px', width: '100%', minHeight: 'auto', height: '100%', fontSize: '12px', borderRadius: '6px', textAlign: 'right', outline: 'none' }}
                    placeholder="0.00"
                  />
                </div>
                <button 
                  onClick={() => { setEnableShipping(false); setShipping(0); }} 
                  style={{ justifySelf: 'center', color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}
                  className="hover-text-error"
                >
                  <Trash2 size={14} />
                </button>
                <span className="font-medium text-secondary" style={{ textAlign: 'right' }}>
                  {formatCurrency(Number(totals.shipping), currency)}
                </span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px', height: '32px' }}>
                <span className="text-secondary">Shipping</span>
                <button 
                  className="text-primary" 
                  style={{ justifySelf: 'start', padding: 0, minHeight: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                  onClick={() => setEnableShipping(true)}
                >
                  + Add shipping
                </button>
                <div></div>
                <div></div>
              </div>
            )}

            <div style={{ borderTop: '1px solid #E4E7EC', margin: '4px 0' }} />

            {/* Total Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '15px', color: 'var(--color-text-main)', fontWeight: 600 }}>
              <span>Total</span>
              <div></div>
              <div></div>
              <span style={{ textAlign: 'right' }}>{formatCurrency(totals.total, currency)}</span>
            </div>

            {/* Amount Paid Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
              <span className="text-secondary">Amount Paid</span>
              <div></div>
              <div></div>
              <div style={{ position: 'relative', width: '92px', height: '32px', justifySelf: 'end' }}>
                <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }}>{symbol}</span>
                <input 
                  type="text" 
                  value={totals.amountPaid !== undefined ? totals.amountPaid : ''}
                  onChange={(e) => {
                    if (isValidDecimalInput(e.target.value)) setAmountPaid(e.target.value);
                  }}
                  style={{ border: '1px solid var(--color-border)', padding: '0 6px 0 16px', width: '100%', minHeight: 'auto', height: '100%', fontSize: '12px', borderRadius: '6px', textAlign: 'right', outline: 'none' }}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Balance Due Block (Premium Blue, centered text, 56px height) */}
            <div style={{
              background: '#EEF4FF',
              border: '1px solid rgba(21, 94, 239, 0.2)',
              borderRadius: '8px',
              minHeight: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              marginTop: '8px'
            }}>
              <span style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: '14px' }}>Balance Due</span>
              <span style={{ color: '#155EEF', fontWeight: 800, fontSize: '20px' }}>
                {formatCurrency(totals.balanceDue, currency)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM ACTION BAR */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#FFFFFF',
        borderTop: '1px solid #EAECF0',
        padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
        display: 'flex',
        gap: '12px',
        zIndex: 1000
      }} className="mobile-only">
        {currentStage === 1 && (
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStage(2)}>
            Continue to Client
          </button>
        )}
        {currentStage === 2 && (
          <>
            <button className="btn btn-outline" style={{ flex: 1, height: '48px', fontWeight: 600 }} onClick={() => setStage(1)}>
              Back
            </button>
            <button className="btn btn-primary" style={{ flex: 2, height: '48px', fontWeight: 600 }} onClick={() => setStage(3)}>
              Continue to Items
            </button>
          </>
        )}
        {currentStage === 3 && (
          <>
            <button className="btn btn-outline" style={{ flex: 1, height: '48px', fontWeight: 600 }} onClick={() => setStage(2)}>
              Back
            </button>
            <button className="btn btn-primary" style={{ flex: 2, height: '48px', fontWeight: 600 }} onClick={() => setStage(4)}>
              Review Invoice
            </button>
          </>
        )}
        {currentStage === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <button className="btn btn-primary" style={{ width: '100%', height: '48px', fontWeight: 600 }} onClick={onDownloadPDF}>
              Download PDF
            </button>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button className="btn btn-outline" style={{ flex: 1, height: '48px', fontWeight: 600 }} onClick={() => setStage(3)}>
                Back
              </button>
              <button className="btn btn-outline" style={{ flex: 1, height: '48px', fontWeight: 600 }} onClick={onOpenFullPreview}>
                Preview
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .hover-text-error:hover { color: var(--color-error) !important; }
        .mobile-item-card .btn-action-dup:hover { background-color: #F2F4F7; color: #344054 !important; }
        .mobile-item-card .btn-action-del:hover { background-color: #FEF3F2; color: #D92D20 !important; }
      `}</style>
    </div>
  );
};
