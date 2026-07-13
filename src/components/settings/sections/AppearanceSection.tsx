import React from 'react';
import { useSettings } from '../../../contexts/SettingsContext';

export const AppearanceSection: React.FC = () => {
  const { settings, updateNestedSetting } = useSettings();
  const app = settings.appearance;

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>Appearance</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: 0 }}>
          Customize the application's look and feel.
        </p>
      </div>

      <div className="card flex-col gap-5">
        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          Interface Theme
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="form-group">
            <label>Theme</label>
            <select 
              className="input" 
              value={app.theme} 
              onChange={(e) => updateNestedSetting('appearance', { theme: e.target.value as any })}
            >
              <option value="system">System Default</option>
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
            <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '8px' }}>
              Note: Full dark mode support is coming in a future update.
            </p>
          </div>
        </div>
      </div>
      
      <div className="card flex-col gap-5">
        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          Editor Layout (Future feature)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', opacity: 0.5, pointerEvents: 'none' }}>
          <div className="form-group">
            <label>Density</label>
            <select 
              className="input" 
              value={app.layoutMode} 
              onChange={(e) => updateNestedSetting('appearance', { layoutMode: e.target.value as any })}
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
