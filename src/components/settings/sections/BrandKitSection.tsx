import React from 'react';
import { useSettings } from '../../../contexts/SettingsContext';
import { UploadCloud, X } from 'lucide-react';
import { processImageFile } from '../../../utils/image';

export const BrandKitSection: React.FC = () => {
  const { settings, updateNestedSetting } = useSettings();
  const brand = settings.brandKit;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const logoUrl = await processImageFile(file);
        updateNestedSetting('brandKit', { logoUrl });
      } catch (error) {
        console.error('Error processing logo:', error);
      }
    }
  };

  const colors = [
    { label: 'Primary Color', field: 'primaryColor' as const, value: brand.primaryColor },
    { label: 'Secondary Color', field: 'secondaryColor' as const, value: brand.secondaryColor },
    { label: 'Accent Color', field: 'accentColor' as const, value: brand.accentColor }
  ];

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>Brand Kit</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: 0 }}>
          Customize how your invoices look by default. Upload a logo and set your brand colors.
        </p>
      </div>

      <div className="card flex-col gap-5">
        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          Business Logo
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {brand.logoUrl ? (
            <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '16px', border: '2px solid var(--color-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)' }}>
              <img src={brand.logoUrl} alt="Logo" loading="lazy" decoding="async" width="160" height="160" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              <button 
                aria-label="Remove logo"
                onClick={() => updateNestedSetting('brandKit', { logoUrl: null })}
                style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', padding: '4px', border: 'none', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label style={{ 
              width: '160px', height: '160px', 
              borderRadius: '16px', 
              border: '2px dashed var(--color-border)', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              background: 'var(--color-surface)'
            }} className="hover-lift">
              <UploadCloud size={32} style={{ marginBottom: '12px', color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Upload Logo</span>
              <span style={{ fontSize: '12px', marginTop: '4px' }}>PNG or JPG</span>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
            </label>
          )}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Your logo will be automatically placed on every new invoice. We recommend using a high-resolution PNG with a transparent background for the best results on exported PDFs.
            </p>
          </div>
        </div>
      </div>

      <div className="card flex-col gap-5">
        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          Brand Colors
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {colors.map(c => (
            <div key={c.field} className="form-group">
              <label>{c.label}</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="color" 
                  value={c.value} 
                  onChange={(e) => updateNestedSetting('brandKit', { [c.field]: e.target.value })}
                  style={{ width: '48px', height: '48px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                />
                <input 
                  type="text" 
                  className="input" 
                  value={c.value.toUpperCase()}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      updateNestedSetting('brandKit', { [c.field]: val });
                    }
                  }}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
