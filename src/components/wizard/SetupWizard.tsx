import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { processImageFile } from '../../utils/image';
import { CurrencyPicker } from '../ui/CurrencyPicker';
import { LanguagePicker } from '../ui/LanguagePicker';
import { UploadCloud, CheckCircle, ChevronRight, Globe, Image as ImageIcon, Building2, X } from 'lucide-react';
import { Logo as AppLogo } from '../ui/Logo';

interface SetupWizardProps {
  onComplete: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const { settings, updateNestedSetting, updateSettings } = useSettings();
  const [step, setStep] = useState(1);

  // Local state for Step 1
  const [businessName, setBusinessName] = useState(settings.businessProfile.name);
  const [email, setEmail] = useState(settings.businessProfile.email);
  const [country, setCountry] = useState(settings.businessProfile.country || settings.localization.country);

  const handleNext = () => setStep(s => s + 1);

  const handleComplete = () => {
    updateSettings({ _hasCompletedFirstRun: true });
    onComplete();
  };

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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex-col gap-4 animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'inline-flex', padding: '16px', background: '#EEF4FF', borderRadius: '50%', color: '#155EEF', marginBottom: '16px' }}>
                <Building2 size={32} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px' }}>Tell us about your business</h2>
              <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>This will appear on all your invoices.</p>
            </div>
            
            <div className="form-group">
              <label>Business Name</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Acme Corp" 
                value={businessName}
                onChange={(e) => {
                  setBusinessName(e.target.value);
                  updateNestedSetting('businessProfile', { name: e.target.value });
                }}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Email Address (Optional)</label>
              <input 
                type="email" 
                className="input" 
                placeholder="billing@acme.com" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  updateNestedSetting('businessProfile', { email: e.target.value });
                }}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input 
                type="text" 
                className="input" 
                placeholder="United States" 
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  updateNestedSetting('businessProfile', { country: e.target.value });
                  updateNestedSetting('localization', { country: e.target.value });
                }}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex-col gap-4 animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'inline-flex', padding: '16px', background: '#F0F9FF', borderRadius: '50%', color: '#0284C7', marginBottom: '16px' }}>
                <Globe size={32} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px' }}>Currency & Language</h2>
              <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>We've auto-detected your region, but you can change it.</p>
            </div>
            
            <div className="form-group">
              <label>Default Currency</label>
              <CurrencyPicker 
                value={settings.invoiceDefaults.defaultCurrency} 
                onChange={(curr) => updateNestedSetting('invoiceDefaults', { defaultCurrency: curr })} 
              />
            </div>
            <div className="form-group">
              <label>Language</label>
              <LanguagePicker 
                value={settings.localization.language} 
                onChange={(lang) => updateNestedSetting('localization', { language: lang })} 
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex-col gap-4 animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'inline-flex', padding: '16px', background: '#FDF4FF', borderRadius: '50%', color: '#C026D3', marginBottom: '16px' }}>
                <ImageIcon size={32} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px' }}>Upload your Logo</h2>
              <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Make your invoices look professional.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              {settings.brandKit.logoUrl ? (
                <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '16px', border: '2px solid var(--color-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)' }}>
                  <img src={settings.brandKit.logoUrl} alt="Logo" loading="lazy" width="160" height="160" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
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
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex-col gap-4 animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: '#ECFDF5', borderRadius: '50%', color: '#059669', marginBottom: '24px' }}>
              <CheckCircle size={48} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 12px' }}>You're all set!</h2>
            <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 24px', fontSize: '16px', lineHeight: 1.5, maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
              Your business workspace is ready. Every new invoice you create will automatically use these settings.
            </p>
          </div>
        );
    }
  };

  return (
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 9999, 
      backgroundColor: 'var(--color-background)',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Simple Header */}
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AppLogo size={32} hideText />
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-main)' }}>Invoice-Gen.net</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '40px' }}>
          
          {/* Progress Indicators */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ 
                flex: 1, 
                height: '4px', 
                borderRadius: '2px', 
                backgroundColor: i <= step ? 'var(--color-primary)' : 'var(--color-border)',
                transition: 'background-color 0.3s ease'
              }} />
            ))}
          </div>

          <div style={{ minHeight: '300px' }}>
            {renderStepContent()}
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
            {step > 1 && step < 4 ? (
              <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>
                Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button 
                className="btn btn-primary" 
                onClick={handleNext}
                disabled={step === 1 && !businessName.trim()}
                style={{ padding: '0 24px' }}
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                className="btn btn-primary" 
                onClick={handleComplete}
                style={{ width: '100%', padding: '12px', fontSize: '16px' }}
              >
                Go to Workspace
              </button>
            )}
          </div>
          
          {step < 4 && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button 
                className="btn btn-ghost" 
                style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}
                onClick={handleComplete}
              >
                Skip setup for now
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
