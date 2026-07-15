import React from 'react';
import { UploadCloud, Trash2, Edit2, Building2, Mail, Phone, FileText, MapPin, Hash, Calendar } from 'lucide-react';
import type { InvoiceData } from '../../types/invoice';
import { processImageFile } from '../../utils/image';
import { Input } from '../ui/Input';
import { CurrencyPicker } from '../ui/CurrencyPicker';
import { useSettings } from '../../contexts/SettingsContext';

interface BusinessSectionProps {
  data: InvoiceData;
  updateBusiness: (updates: Partial<InvoiceData['business']>) => void;
  updateDetails: (updates: Partial<InvoiceData['details']>) => void;
}

const BusinessSectionComponent: React.FC<BusinessSectionProps> = ({ data, updateBusiness, updateDetails }) => {
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
    <div style={{ 
      width: '100%', 
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '32px'
    }}>
      
      {/* Section Header & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: '#F8FAFC', color: '#64748B', borderRadius: '10px', display: 'flex' }}>
            <Building2 size={18} />
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', margin: 0 }}>Business Details</h2>
        </div>
        
        {/* Logo Upload placed beautifully next to title */}
        <div>
          {data.business.logoUrl ? (
            <div style={{
              width: '64px',
              height: '64px',
              position: 'relative',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <img src={data.business.logoUrl} alt="Logo" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
              width: '64px',
              height: '64px',
              border: '2px dashed #CBD5E1',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer',
              background: '#F8FAFC',
              color: '#64748B',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
            onMouseOver={(e) => { 
              e.currentTarget.style.borderColor = '#00A65A'; 
              e.currentTarget.style.backgroundColor = '#E8F8F0'; 
              e.currentTarget.style.color = '#00A65A';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 166, 90, 0.1)';
            }}
            onMouseOut={(e) => { 
              e.currentTarget.style.borderColor = '#CBD5E1'; 
              e.currentTarget.style.backgroundColor = '#F8FAFC'; 
              e.currentTarget.style.color = '#64748B';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
            }}
            >
              <UploadCloud size={20} />
              <span style={{ fontSize: '10px', fontWeight: 600 }}>Logo</span>
              <input id="business-logo-upload-input" aria-label="Upload business logo" type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            </label>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', marginBottom: '16px' }}>
        <div className="grid-2">
          <Input 
            id="business-name-input"
            label="Your business name"
            type="text" 
            placeholder="E.g. Acme Corp"
            value={data.business.name}
            onChange={(e) => updateBusiness({ name: e.target.value })}
            leftIcon={<Building2 size={16} />}
          />
          <Input 
            id="business-email-input"
            label="Email"
            type="email" 
            placeholder="biz@email.com"
            value={data.business.email}
            onChange={(e) => updateBusiness({ email: e.target.value })}
            leftIcon={<Mail size={16} />}
          />
        </div>
        
        <div className="grid-2">
          <Input 
            id="business-phone-input"
            label="Phone Number"
            type="tel" 
            placeholder="+1 234 567 890"
            value={data.business.phone || ''}
            onChange={(e) => updateBusiness({ phone: e.target.value })}
            leftIcon={<Phone size={16} />}
          />
          <Input 
            id="business-taxid-input"
            label="Tax ID (optional)"
            type="text" 
            placeholder="E.g. AB1234567"
            value={data.business.taxId || ''}
            onChange={(e) => updateBusiness({ taxId: e.target.value })}
            leftIcon={<FileText size={16} />}
          />
        </div>

      {/* Full Width Address */}
      <Input 
        id="business-address1-input"
        label="Address"
        type="text" 
        placeholder="123 Business Rd, City, Country"
        value={data.business.address1 || ''}
        onChange={(e) => updateBusiness({ address1: e.target.value })}
        leftIcon={<MapPin size={16} />}
      />

    </div>
      {/* Invoice Specific Details (Required but not in visual mockup) */}
      <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '8px', background: '#F8FAFC', color: '#64748B', borderRadius: '10px', display: 'flex' }}>
            <FileText size={18} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', margin: 0 }}>Invoice Settings</h3>
        </div>
        <div className="grid-4">
          <Input 
            id="invoice-number-input"
            label="Invoice Number *"
            type="text" 
            placeholder="INV-001"
            value={data.details.invoiceNumber}
            onChange={(e) => updateDetails({ invoiceNumber: e.target.value })}
            leftIcon={<Hash size={16} />}
          />
          <Input 
            id="invoice-issue-date-input"
            label="Issue Date"
            type="date" 
            value={data.details.issueDate}
            onChange={(e) => updateDetails({ issueDate: e.target.value })}
            leftIcon={<Calendar size={16} />}
          />
          <Input 
            id="invoice-due-date-input"
            label="Due Date"
            type="date" 
            value={data.details.dueDate}
            onChange={(e) => updateDetails({ dueDate: e.target.value })}
            leftIcon={<Calendar size={16} />}
          />
          <CurrencyPicker 
            label="Currency"
            value={data.details.currency || settings.localization.currency}
            onChange={(c) => {
              updateDetails({ currency: c });
              updateNestedSetting('localization', { currency: c });
            }}
          />
        </div>
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
