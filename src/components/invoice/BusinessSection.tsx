import React, { useState } from 'react';
import { UploadCloud, Trash2, Edit2 } from 'lucide-react';
import type { InvoiceData } from '../../types/invoice';
import { processImageFile } from '../../utils/image';

interface BusinessSectionProps {
  data: InvoiceData;
  updateBusiness: (updates: Partial<InvoiceData['business']>) => void;
  updateDetails: (updates: Partial<InvoiceData['details']>) => void;
}

export const BusinessSection: React.FC<BusinessSectionProps> = ({ data, updateBusiness, updateDetails }) => {
  const [showOptional, setShowOptional] = useState(false);

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

  return (
    <div className="flex-col gap-6" style={{ width: '100%', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-6)' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
        <span className="step-badge">01</span>
        <div className="flex-col">
          <h3 className="font-bold text-base" style={{ lineHeight: 1.2, margin: 0, color: 'var(--color-text-main)' }}>Business details</h3>
          <span className="text-xs text-secondary">Your information shown on the invoice.</span>
        </div>
      </div>

      <div className="business-grid">
        {/* Left Column: Business Identity */}
        <div className="flex-col" style={{ width: '100%' }}>
          {/* Top row: Logo Upload and Business Name */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-end', width: '100%', marginBottom: '16px' }}>
            {/* Logo Upload (120x96px) */}
            <div style={{ flex: '0 0 120px', width: '120px', height: '96px' }}>
              {data.business.logoUrl ? (
                <div style={{
                  width: '120px',
                  height: '96px',
                  position: 'relative',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img src={data.business.logoUrl} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.4)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }} className="logo-hover-overlay">
                    <label style={{ cursor: 'pointer' }}>
                      <Edit2 size={14} color="white" />
                      <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                    </label>
                    <button onClick={() => updateBusiness({ logoUrl: null })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <Trash2 size={14} color="white" />
                    </button>
                  </div>
                  <style>{`.logo-hover-overlay:hover { opacity: 1 !important; }`}</style>
                </div>
              ) : (
                <label style={{
                  width: '120px',
                  height: '96px',
                  border: '1px dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  cursor: 'pointer',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)',
                  transition: 'border-color 0.2s'
                }}>
                  <UploadCloud size={20} className="text-secondary" />
                  <span style={{ fontSize: '11px', fontWeight: 500 }}>Add logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                </label>
              )}
            </div>

            {/* Business Name Field (fills remaining width) */}
            <div style={{ flex: 1 }}>
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Business Name *</label>
              <input 
                type="text" 
                placeholder="Your Business Name"
                value={data.business.name}
                onChange={(e) => updateBusiness({ name: e.target.value })}
              />
            </div>
          </div>

          {/* Email Field stacked below (full width across left column) */}
          <div style={{ width: '100%', marginBottom: '12px' }}>
            <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Email *</label>
            <input 
              type="email" 
              placeholder="you@example.com"
              value={data.business.email}
              onChange={(e) => updateBusiness({ email: e.target.value })}
            />
          </div>

          {/* Toggleable optional fields */}
          <div className="flex-col" style={{ width: '100%' }}>
            {showOptional ? (
              <div className="flex-col gap-3" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
                <div className="grid-2">
                  <div>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Phone</label>
                    <input 
                      type="tel" 
                      placeholder="Phone number"
                      value={data.business.phone || ''}
                      onChange={(e) => updateBusiness({ phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Website</label>
                    <input 
                      type="url" 
                      placeholder="e.g. www.website.com"
                      value={data.business.website || ''}
                      onChange={(e) => updateBusiness({ website: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Address Line 1</label>
                  <input 
                    type="text" 
                    placeholder="Street address"
                    value={data.business.address1 || ''}
                    onChange={(e) => updateBusiness({ address1: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Address Line 2</label>
                  <input 
                    type="text" 
                    placeholder="Apt, suite, etc. (optional)"
                    value={data.business.address2 || ''}
                    onChange={(e) => updateBusiness({ address2: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>City</label>
                    <input 
                      type="text" 
                      placeholder="City"
                      value={data.business.city || ''}
                      onChange={(e) => updateBusiness({ city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>State / Province</label>
                    <input 
                      type="text" 
                      placeholder="State or Region"
                      value={data.business.state || ''}
                      onChange={(e) => updateBusiness({ state: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Postal / ZIP Code</label>
                    <input 
                      type="text" 
                      placeholder="Postal code"
                      value={data.business.postalCode || ''}
                      onChange={(e) => updateBusiness({ postalCode: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '6px' }}>Country</label>
                    <input 
                      type="text" 
                      placeholder="Country"
                      value={data.business.country || ''}
                      onChange={(e) => updateBusiness({ country: e.target.value })}
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
                  />
                </div>

                <button 
                  className="btn btn-ghost text-primary text-xs" 
                  style={{ paddingLeft: 0, justifyContent: 'flex-start', alignSelf: 'flex-start', minHeight: 'auto', padding: '4px 0', marginTop: '4px' }}
                  onClick={() => setShowOptional(false)}
                >
                  − Hide additional business details
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-ghost text-primary text-xs" 
                style={{ paddingLeft: 0, justifyContent: 'flex-start', alignSelf: 'flex-start', minHeight: 'auto', padding: '4px 0' }}
                onClick={() => setShowOptional(true)}
              >
                + Add more business details
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Invoice Details */}
        <div className="flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-secondary" style={{ width: '110px' }}>Invoice Number</span>
            <input 
              type="text" 
              value={data.details.invoiceNumber}
              onChange={(e) => updateDetails({ invoiceNumber: e.target.value })}
              style={{ flex: 1 }}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-secondary" style={{ width: '110px' }}>Issue Date</span>
            <input 
              type="date" 
              value={data.details.issueDate}
              onChange={(e) => updateDetails({ issueDate: e.target.value })}
              style={{ flex: 1 }}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-secondary" style={{ width: '110px' }}>Due Date</span>
            <input 
              type="date" 
              value={data.details.dueDate}
              onChange={(e) => updateDetails({ dueDate: e.target.value })}
              style={{ flex: 1 }}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-secondary" style={{ width: '110px' }}>Currency</span>
            <select 
              value={data.details.currency}
              onChange={(e) => updateDetails({ currency: e.target.value })}
              style={{ flex: 1 }}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
