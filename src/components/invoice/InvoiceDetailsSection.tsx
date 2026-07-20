import React from 'react';
import { FileText, Hash, Calendar } from 'lucide-react';
import type { InvoiceData } from '../../types/invoice';
import { Input } from '../ui/Input';
import { CurrencyPicker } from '../ui/CurrencyPicker';
import { useSettings } from '../../contexts/SettingsContext';

interface InvoiceDetailsSectionProps {
  data: InvoiceData;
  updateDetails: (updates: Partial<InvoiceData['details']>) => void;
}

export const InvoiceDetailsSection: React.FC<InvoiceDetailsSectionProps> = React.memo(({ data, updateDetails }) => {
  const { settings, updateNestedSetting } = useSettings();

  return (
    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #F1F5F9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ padding: '8px', background: 'rgba(0, 166, 90, 0.1)', color: '#00A65A', borderRadius: '10px', display: 'flex' }}>
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
  );
}, (prevProps, nextProps) => prevProps.data.details === nextProps.data.details);
