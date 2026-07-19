import React from 'react';
import { UploadCloud, Trash2, Edit2, Building2, Mail, Phone, FileText, MapPin } from 'lucide-react';
import type { InvoiceData } from '../../types/invoice';
import { processImageFile } from '../../utils/image';
import { Input } from '../ui/Input';

interface BusinessSectionProps {
  data: InvoiceData | any; // Use any to allow PurchaseOrderData to be passed here
  updateBusiness: (updates: any) => void;
}

const BusinessSectionComponent: React.FC<BusinessSectionProps> = ({ data, updateBusiness }) => {

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
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '16px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '16px', display: 'flex' }}>
          <Building2 size={28} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-title)', margin: 0, letterSpacing: '-0.5px' }}>Business Details</h2>
          <span style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Your company information and logo</span>
        </div>
      </div>
      
      {/* Logo Upload */}
      <div style={{ marginBottom: '32px' }}>
        {data.business.logoUrl ? (
          <div style={{
            width: '100%',
            height: '200px',
            position: 'relative',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <img src={data.business.logoUrl} alt="Logo" loading="lazy" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              opacity: 0,
              transition: 'opacity 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }} className="logo-hover-overlay">
              <label htmlFor="business-logo-edit-input" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: 'black', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
                <Edit2 size={16} /> Change Logo
                <input id="business-logo-edit-input" aria-label="Change business logo" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} style={{ display: 'none' }} />
              </label>
              <button aria-label="Delete logo" onClick={() => updateBusiness({ logoUrl: null })} style={{ background: '#DC2626', color: 'white', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}>
                <Trash2 size={16} /> Remove
              </button>
            </div>
            <style>{`.logo-hover-overlay:hover { opacity: 1 !important; }`}</style>
          </div>
        ) : (
          <label htmlFor="business-logo-upload-input" style={{
            width: '100%',
            height: '200px',
            border: '2px dashed var(--color-border)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            background: 'var(--color-background)',
            color: 'var(--color-text-secondary)',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => { 
            e.currentTarget.style.borderColor = 'var(--color-primary)'; 
            e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'; 
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          onMouseOut={(e) => { 
            e.currentTarget.style.borderColor = 'var(--color-border)'; 
            e.currentTarget.style.backgroundColor = 'var(--color-background)'; 
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
          >
            <div style={{ background: 'white', padding: '16px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <UploadCloud size={32} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '16px', fontWeight: 600 }}>Click or drag & drop logo</span>
              <span style={{ fontSize: '14px', color: 'var(--color-text-tertiary)' }}>Supports PNG, JPG, or SVG (Max 5MB)</span>
            </div>
            <input id="business-logo-upload-input" aria-label="Upload business logo" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} style={{ display: 'none' }} />
          </label>
        )}
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
            inputMode="email"
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
            inputMode="tel"
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
    </div>
  );
};

export const BusinessSection = React.memo(
  BusinessSectionComponent,
  (prevProps, nextProps) => {
    return prevProps.data.business === nextProps.data.business &&
           prevProps.data.buyer === nextProps.data.buyer;
  }
);
