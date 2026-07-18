import React from 'react';
import { FileText, Hash, Calendar } from 'lucide-react';
import type { QuoteData } from '../../types/quote';
import { Input } from '../ui/Input';
import { CurrencyPicker } from '../ui/CurrencyPicker';

interface QuoteDetailsSectionProps {
  details: QuoteData['details'];
  onChange: (updates: Partial<QuoteData['details']>) => void;
}

export const QuoteDetailsSection: React.FC<QuoteDetailsSectionProps> = React.memo(({ details, onChange }) => {
  return (
    <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #F1F5F9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ padding: '8px', background: '#F8FAFC', color: '#64748B', borderRadius: '10px', display: 'flex' }}>
          <FileText size={18} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', margin: 0 }}>Quote Details</h3>
      </div>
      <div className="grid-4">
        <Input 
          id="quote-number-input"
          label="Quote Number *"
          type="text" 
          placeholder="QTE-001"
          value={details.quoteNumber}
          onChange={(e) => onChange({ quoteNumber: e.target.value })}
          leftIcon={<Hash size={16} />}
        />
        <Input 
          id="quote-date-input"
          label="Issue Date"
          type="date" 
          value={details.issueDate}
          onChange={(e) => onChange({ issueDate: e.target.value })}
          leftIcon={<Calendar size={16} />}
        />
        <Input 
          id="quote-valid-until-input"
          label="Valid Until"
          type="date" 
          value={details.validUntil}
          onChange={(e) => onChange({ validUntil: e.target.value })}
          leftIcon={<Calendar size={16} />}
        />
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>
            Currency
          </label>
          <CurrencyPicker 
            value={details.currency} 
            onChange={(val) => onChange({ currency: val })}
          />
        </div>
      </div>
    </div>
  );
});
