import React, { useState } from 'react';
import { UploadCloud, Trash2, Edit2, LayoutTemplate } from 'lucide-react';
import type { InvoiceData } from '../../types/invoice';
import { processImageFile } from '../../utils/image';
import { Input } from '../ui/Input';
import { CurrencyPicker } from '../ui/CurrencyPicker';
import { LanguagePicker } from '../ui/LanguagePicker';
import { useSettings } from '../../contexts/SettingsContext';

interface BusinessSectionProps {
  data: InvoiceData;
  updateBusiness: (updates: Partial<InvoiceData['business']>) => void;
  updateDetails: (updates: Partial<InvoiceData['details']>) => void;
  onOpenTemplateGallery?: () => void;
}

const BusinessSectionComponent: React.FC<BusinessSectionProps> = ({ data, updateBusiness, updateDetails, onOpenTemplateGallery }) => {
  const [showOptional, setShowOptional] = useState(false);
  const { settings, updateNestedSetting } = useSettings();

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
      {/* Template Banner (only show if empty and onOpenTemplateGallery is provided) */}
      {onOpenTemplateGallery && (!data.items.length || (!data.items[0].name && !data.items[0].rate)) && !data.business.name && (
        <div 
          onClick={onOpenTemplateGallery}
          className="hover-lift"
          style={{ 
            backgroundColor: 'var(--color-primary-light)', 
            border: '1px dashed var(--color-primary)', 
            borderRadius: 'var(--radius-lg)', 
            padding: 'var(--space-4)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: 'var(--space-2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: 'var(--color-primary)', color: '#FFFFFF', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)', display: 'flex' }}>
              <LayoutTemplate size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-title)' }}>Start with a Template</h3>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Choose a professional layout tailored for your industry.</p>
            </div>
          </div>
          <button className="btn btn-primary" style={{ padding: '8px 16px' }}>Browse Templates</button>
        </div>
      )}

      {/* Logo Upload */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', width: '100%', marginBottom: 'var(--space-2)' }}>
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
              <img src={data.business.logoUrl} alt="Logo" loading="lazy" width="64" height="64" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                <label htmlFor="business-logo-edit-input" style={{ cursor: 'pointer' }}>
                  <Edit2 size={14} color="white" />
                  <input id="business-logo-edit-input" aria-label="Change business logo" type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                </label>
                <button aria-label="Delete logo" onClick={() => updateBusiness({ logoUrl: null })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Trash2 size={14} color="white" />
                </button>
              </div>
              <style>{`.logo-hover-overlay:hover { opacity: 1 !important; }`}</style>
            </div>
          ) : (
            <label htmlFor="business-logo-upload-input" style={{
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
              <input id="business-logo-upload-input" aria-label="Upload business logo" type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            </label>
          )}
        </div>
      </div>

      <div className="flex-col gap-4">
        {/* Row 1: Business Name & Invoice Number */}
        <div className="grid-2">
          <Input 
            id="business-name-input"
            label="Business Name *"
            type="text" 
            placeholder="Your Business Name"
            value={data.business.name}
            onChange={(e) => updateBusiness({ name: e.target.value })}
          />
          <Input 
            id="invoice-number-input"
            label="Invoice Number *"
            type="text" 
            value={data.details.invoiceNumber}
            onChange={(e) => updateDetails({ invoiceNumber: e.target.value })}
          />
        </div>

        {/* Row 2: Email & Phone */}
        <div className="grid-2">
          <Input 
            id="business-email-input"
            label="Email *"
            type="email" 
            placeholder="you@example.com"
            value={data.business.email}
            onChange={(e) => updateBusiness({ email: e.target.value })}
          />
          <Input 
            id="business-phone-input"
            label="Phone"
            type="tel" 
            placeholder="Phone number"
            value={data.business.phone || ''}
            onChange={(e) => updateBusiness({ phone: e.target.value })}
          />
        </div>

        {/* Row 3: Issue Date & Due Date */}
        <div className="grid-2">
          <Input 
            id="invoice-issue-date-input"
            label="Issue Date"
            type="date" 
            value={data.details.issueDate}
            onChange={(e) => updateDetails({ issueDate: e.target.value })}
          />
          <Input 
            id="invoice-due-date-input"
            label="Due Date"
            type="date" 
            value={data.details.dueDate}
            onChange={(e) => updateDetails({ dueDate: e.target.value })}
          />
        </div>

        {/* Row 4: Currency & Language */}
        <div className="grid-2">
          <CurrencyPicker 
            label="Currency"
            value={data.details.currency || settings.localization.currency}
            onChange={(c) => {
              updateDetails({ currency: c });
              updateNestedSetting('localization', { currency: c });
            }}
          />
          <LanguagePicker
            label="Language"
            value={settings.localization.language}
            onChange={(l) => updateNestedSetting('localization', { language: l })}
          />
        </div>

        {/* Toggleable optional fields */}
        {showOptional ? (
          <div className="flex-col gap-4" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
            <Input 
              id="business-website-input"
              label="Website"
              type="url" 
              placeholder="e.g. www.website.com"
              value={data.business.website || ''}
              onChange={(e) => updateBusiness({ website: e.target.value })}
            />
            
            <Input 
              id="business-address1-input"
              label="Address Line 1"
              type="text" 
              placeholder="Street address"
              value={data.business.address1 || ''}
              onChange={(e) => updateBusiness({ address1: e.target.value })}
            />
            
            <Input 
              id="business-address2-input"
              label="Address Line 2"
              type="text" 
              placeholder="Apt, suite, etc. (optional)"
              value={data.business.address2 || ''}
              onChange={(e) => updateBusiness({ address2: e.target.value })}
            />

            <div className="grid-2">
              <Input 
                id="business-city-input"
                label="City"
                type="text" 
                placeholder="City"
                value={data.business.city || ''}
                onChange={(e) => updateBusiness({ city: e.target.value })}
              />
              <Input 
                id="business-state-input"
                label="State / Province"
                type="text" 
                placeholder="State or Region"
                value={data.business.state || ''}
                onChange={(e) => updateBusiness({ state: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <Input 
                id="business-postal-input"
                label="Postal / ZIP Code"
                type="text" 
                placeholder="Postal code"
                value={data.business.postalCode || ''}
                onChange={(e) => updateBusiness({ postalCode: e.target.value })}
              />
              <Input 
                id="business-country-input"
                label="Country"
                type="text" 
                placeholder="Country"
                value={data.business.country || ''}
                onChange={(e) => updateBusiness({ country: e.target.value })}
              />
            </div>

            <Input 
              id="business-taxid-input"
              label="Tax ID / VAT Number"
              type="text" 
              placeholder="e.g. VAT / GST ID"
              value={data.business.taxId || ''}
              onChange={(e) => updateBusiness({ taxId: e.target.value })}
            />

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
  );
};

export const BusinessSection = React.memo(
  BusinessSectionComponent,
  (prevProps, nextProps) => {
    return prevProps.data.business === nextProps.data.business &&
           prevProps.data.details === nextProps.data.details;
  }
);
