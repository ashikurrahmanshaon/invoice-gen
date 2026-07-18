import React from 'react';
import { FileText, Hash, Calendar } from 'lucide-react';
import type { PurchaseOrderData } from '../../types/purchaseOrder';
import { Input } from '../ui/Input';
import { CurrencyPicker } from '../ui/CurrencyPicker';
import { useSettings } from '../../contexts/SettingsContext';

interface PODetailsSectionProps {
  data: PurchaseOrderData;
  updateDetails: (updates: Partial<PurchaseOrderData['details']>) => void;
}

export const PODetailsSection: React.FC<PODetailsSectionProps> = React.memo(({ data, updateDetails }) => {
  const { settings, updateNestedSetting } = useSettings();

  return (
    <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #F1F5F9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ padding: '8px', background: '#F8FAFC', color: '#64748B', borderRadius: '10px', display: 'flex' }}>
          <FileText size={18} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', margin: 0 }}>Purchase Order Details</h3>
      </div>
      <div className="grid-4">
        <Input 
          id="po-number-input"
          label="PO Number *"
          type="text" 
          placeholder="PO-001"
          value={data.details.poNumber}
          onChange={(e) => updateDetails({ poNumber: e.target.value })}
          leftIcon={<Hash size={16} />}
        />
        <Input 
          id="po-date-input"
          label="PO Date"
          type="date" 
          value={data.details.poDate}
          onChange={(e) => updateDetails({ poDate: e.target.value })}
          leftIcon={<Calendar size={16} />}
        />
        <Input 
          id="po-delivery-date-input"
          label="Delivery Date"
          type="date" 
          value={data.details.expectedDeliveryDate}
          onChange={(e) => updateDetails({ expectedDeliveryDate: e.target.value })}
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
