import React from 'react';
import { useSettings } from '../../../contexts/SettingsContext';
import { LanguagePicker } from '../../ui/LanguagePicker';
import { CurrencyPicker } from '../../ui/CurrencyPicker';

export const LocalizationSection: React.FC = () => {
  const { settings, updateNestedSetting } = useSettings();
  const loc = settings.localization;

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>Localization</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: 0 }}>
          Manage your application language, region, and formatting preferences.
        </p>
      </div>

      <div className="card flex-col gap-5">
        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          Regional Settings
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="form-group">
            <label>Application Language</label>
            <LanguagePicker 
              value={loc.language} 
              onChange={(lang) => updateNestedSetting('localization', { language: lang })} 
            />
          </div>
          <div className="form-group">
            <label>Default Currency</label>
            <CurrencyPicker 
              value={loc.currency} 
              onChange={(curr) => updateNestedSetting('localization', { currency: curr })} 
            />
          </div>
          <div className="form-group">
            <label>Timezone</label>
            <select 
              className="input" 
              value={loc.timezone} 
              onChange={(e) => updateNestedSetting('localization', { timezone: e.target.value })}
            >
              <option value={loc.timezone}>{loc.timezone} (Detected)</option>
              {/* Note: A full timezone list could be added here later */}
            </select>
          </div>
          <div className="form-group">
            <label>Default Paper Size</label>
            <select 
              className="input" 
              value={loc.paperSize} 
              onChange={(e) => updateNestedSetting('localization', { paperSize: e.target.value as any })}
            >
              <option value="A4">A4 (Standard outside North America)</option>
              <option value="Letter">Letter (Standard in North America)</option>
              <option value="Legal">Legal</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
