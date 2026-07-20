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
      marginBottom: '24px'
    }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <div style={{ padding: '10px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '12px', display: 'flex' }}>
          <Building2 size={20} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-title)', margin: 0, letterSpacing: '-0.3px' }}>Business Details</h2>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Your company information and logo</span>
        </div>
      </div>
      
      {/* Logo Upload */}
      <div style={{ marginBottom: '16px', width: '100%' }}>
        <style>{`
          .logo-upload-area {
            width: 100%;
            padding: 16px 20px;
            border: 1px solid var(--color-border);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            background: var(--color-surface);
            transition: all 0.2s ease;
          }
          .logo-upload-area:hover {
            border-color: var(--color-primary);
            box-shadow: 0 2px 8px rgba(0, 166, 90, 0.08);
          }
          .logo-upload-area:hover .browse-btn {
            background: var(--color-primary-faint);
            color: var(--color-primary);
            border-color: var(--color-primary-faint);
          }
          .logo-preview-area {
            width: 100%;
            padding: 16px 20px;
            border-radius: 12px;
            border: 1px solid var(--color-border);
            background: var(--color-surface);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.2s ease;
          }
          .action-btn {
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
          }
          .action-btn-secondary {
            background: white;
            border: 1px solid var(--color-border);
            color: var(--color-text-main);
          }
          .action-btn-secondary:hover {
            background: #F8FAFC;
            border-color: #CBD5E1;
          }
          .action-btn-danger {
            background: rgba(239, 68, 68, 0.05);
            border: 1px solid transparent;
            color: #EF4444;
          }
          .action-btn-danger:hover {
            background: rgba(239, 68, 68, 0.1);
          }
          @media (max-width: 640px) {
            .logo-upload-area, .logo-preview-area {
              flex-direction: column;
              align-items: flex-start;
              gap: 16px;
            }
            .logo-preview-actions {
              width: 100%;
              justify-content: flex-end;
            }
          }
        `}</style>
        {data.business.logoUrl ? (
          <div className="logo-preview-area">
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ width: '60px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: '4px' }}>
                 <img src={data.business.logoUrl} alt="Logo" loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
               </div>
               <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-title)' }}>Company Logo</span>
             </div>
             
             <div className="logo-preview-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <label htmlFor="business-logo-edit-input" className="action-btn action-btn-secondary">
                 <Edit2 size={14} /> Replace
                 <input id="business-logo-edit-input" aria-label="Change business logo" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} style={{ display: 'none' }} />
               </label>
               <button aria-label="Delete logo" onClick={() => updateBusiness({ logoUrl: null })} className="action-btn action-btn-danger">
                 <Trash2 size={14} /> Remove
               </button>
             </div>
          </div>
        ) : (
          <label htmlFor="business-logo-upload-input" className="logo-upload-area">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)' }}>
                <UploadCloud size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-title)' }}>Company Logo</span>
                <span style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>JPG, PNG, SVG up to 5MB</span>
              </div>
            </div>
            <div className="browse-btn" style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'white',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              transition: 'all 0.2s ease',
            }}>
              Browse Files
            </div>
            <input id="business-logo-upload-input" aria-label="Upload business logo" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} style={{ display: 'none' }} />
          </label>
        )}
      </div>

      {/* Main Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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
