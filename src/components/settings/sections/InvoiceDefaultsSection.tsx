import React from 'react';
import { useSettings } from '../../../contexts/SettingsContext';
import { Input } from '../../ui/Input';
import { CurrencyPicker } from '../../ui/CurrencyPicker';

export const InvoiceDefaultsSection: React.FC = () => {
  const { settings, updateNestedSetting } = useSettings();
  const def = settings.invoiceDefaults;

  const handleChange = (field: keyof typeof def) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateNestedSetting('invoiceDefaults', { [field]: e.target.value });
  };

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>Invoice Defaults</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: 0 }}>
          Configure standard settings for all new invoices. These can be overridden on a per-invoice basis.
        </p>
      </div>

      <div className="card flex-col gap-5">
        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          Numbering & Identifiers
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <Input 
              label="Invoice Prefix" 
              value={def.prefix} 
              onChange={handleChange('prefix')} 
              placeholder="INV" 
            />
            <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '4px', marginBottom: 0 }}>e.g. INV, 2026, or your initials</p>
          </div>
          <div className="form-group">
            <label>Number Pattern</label>
            <select 
              className="input" 
              value={def.numberPattern} 
              onChange={(e) => updateNestedSetting('invoiceDefaults', { numberPattern: e.target.value })}
            >
              <option value="{PREFIX}-{SEQ}">{def.prefix}-001</option>
              <option value="{PREFIX}-{YYYY}-{SEQ}">{def.prefix}-{new Date().getFullYear()}-001</option>
              <option value="{YYYY}{MM}-{SEQ}">{new Date().getFullYear()}{String(new Date().getMonth() + 1).padStart(2, '0')}-001</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card flex-col gap-5">
        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          Financials
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="form-group">
            <label>Default Currency</label>
            <CurrencyPicker 
              value={def.defaultCurrency} 
              onChange={(curr) => updateNestedSetting('invoiceDefaults', { defaultCurrency: curr })} 
            />
          </div>
          <Input 
            label="Default Due Date (Days)" 
            type="number"
            value={def.defaultDueDateDays.toString()} 
            onChange={(e) => updateNestedSetting('invoiceDefaults', { defaultDueDateDays: Number(e.target.value) || 0 })} 
            placeholder="14" 
          />
          <Input 
            label="Default Tax Label" 
            value={def.defaultTaxLabel} 
            onChange={handleChange('defaultTaxLabel')} 
            placeholder="Tax" 
          />
          <Input 
            label="Default Tax Rate (%)" 
            type="number"
            value={def.defaultTaxRate.toString()} 
            onChange={(e) => updateNestedSetting('invoiceDefaults', { defaultTaxRate: e.target.value ? Number(e.target.value) : '' })} 
            placeholder="0" 
          />
        </div>
      </div>

      <div className="card flex-col gap-5">
        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          Standard Text Content
        </h4>
        <div className="form-group">
          <label>Default Notes</label>
          <textarea 
            className="input" 
            style={{ height: '80px', resize: 'vertical' }}
            value={def.defaultNotes}
            onChange={handleChange('defaultNotes')}
            placeholder="Thank you for your business..."
          />
        </div>
        <div className="form-group">
          <label>Default Terms & Conditions</label>
          <textarea 
            className="input" 
            style={{ height: '80px', resize: 'vertical' }}
            value={def.defaultTerms}
            onChange={handleChange('defaultTerms')}
            placeholder="Payment is due within 14 days..."
          />
        </div>
        <div className="form-group">
          <label>Footer Notes</label>
          <textarea 
            className="input" 
            style={{ height: '60px', resize: 'vertical' }}
            value={def.defaultFooterNotes}
            onChange={handleChange('defaultFooterNotes')}
            placeholder="Generated by Invoice-Gen.net"
          />
        </div>
      </div>
    </div>
  );
};
