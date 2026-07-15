import React from 'react';
import { Trash2, FileText } from 'lucide-react';
import type { LineItem } from '../../types/invoice';
import { formatCurrency } from '../../utils/currency';
import { isValidDecimalInput, calculateLineAmount } from '../../utils/calculations';
import { Input } from '../ui/Input';

interface ItemsSectionProps {
  items: LineItem[];
  currency: string;
  addItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<LineItem>) => void;
}

interface ItemRowProps {
  item: LineItem;
  currency: string;
  symbol: string;
  updateItem: (id: string, updates: Partial<LineItem>) => void;
  removeItem: (id: string) => void;
}

const ItemRow = React.memo(({ item, currency, symbol, updateItem, removeItem }: ItemRowProps) => {
  return (
    <div className="item-row-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(200px, 2fr) 100px 120px 120px 48px',
      gap: '16px',
      alignItems: 'center',
      minHeight: '64px',
      borderBottom: '1px solid var(--color-border)',
      padding: '12px 0',
      transition: 'background-color var(--transition-fast)'
    }}>
      {/* Item Name */}
      <div>
        <Input 
          type="text" 
          placeholder="Web Design"
          aria-label="Item name"
          value={item.name}
          onChange={(e) => updateItem(item.id, { name: e.target.value })}
        />
      </div>

      {/* Qty (Centered input) */}
      <div>
        <Input 
          type="text"
          inputMode="decimal"
          placeholder="1"
          aria-label="Quantity"
          value={item.quantity}
          onChange={(e) => {
            const val = e.target.value;
            if (isValidDecimalInput(val)) {
              updateItem(item.id, { quantity: val });
            }
          }}
          style={{ textAlign: 'center' }}
        />
      </div>

      {/* Rate Input with currency symbol prefix */}
      <div>
        <div style={{ position: 'relative', width: '100%' }}>
          <span style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--color-text-secondary)',
            fontSize: '13px',
            fontWeight: 500,
            pointerEvents: 'none'
          }}>{symbol}</span>
          <Input 
            type="text"
            inputMode="decimal"
            placeholder="1200"
            aria-label="Rate"
            value={item.rate}
            onChange={(e) => {
              const val = e.target.value;
              if (isValidDecimalInput(val)) {
                updateItem(item.id, { rate: val });
              }
            }}
            style={{ paddingLeft: '28px' }}
          />
        </div>
      </div>

      {/* Amount (Bold & Right-aligned) */}
      <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '14px', color: 'var(--color-text-main)', paddingRight: '4px' }}>
        {formatCurrency(calculateLineAmount(item.rate, item.quantity), currency)}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => removeItem(item.id)}
          className="btn-ghost btn-icon text-error"
          aria-label="Delete item"
          title="Delete item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
});

const ItemsSectionComponent: React.FC<ItemsSectionProps> = ({ 
  items, currency, addItem, removeItem, updateItem 
}) => {
  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const symbol = getCurrencySymbol(currency);

  return (
    <div data-testid="items-section" className="flex-col gap-6" style={{ width: '100%', paddingBottom: '32px', borderBottom: '1px solid #F1F5F9' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '8px' }}>
        <div style={{ padding: '8px', background: 'transparent' }}>
          <FileText size={24} color="#334155" />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B', margin: 0, marginTop: '2px' }}>Line Items</h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>Add the products or services you are billing for.</p>
        </div>
      </div>      {/* Grid Table Container */}
      <div style={{ width: '100%', marginTop: 'var(--space-2)' }} className="items-section-wrapper">
        <div className="items-table-container" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header Row */}
          <div className="items-header-row" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 2fr) 100px 120px 120px 48px',
            gap: '16px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            padding: '12px 16px',
            fontSize: '12px',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: 600,
            borderRadius: '8px 8px 0 0'
          }}>
            <div>Item name</div>
            <div style={{ textAlign: 'center' }}>Quantity</div>
            <div>Rate</div>
            <div style={{ textAlign: 'right' }}>Total</div>
            <div></div>
          </div>

          {/* Body Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px' }}>
            {items.map((item) => (
              <ItemRow 
                key={item.id}
                item={item}
                currency={currency}
                symbol={symbol}
                updateItem={updateItem}
                removeItem={removeItem}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Add Line Item Button */}
      <div style={{ display: 'flex', padding: '0 16px' }}>
        <button 
          className="btn btn-ghost"
          style={{ color: '#2563EB', fontWeight: 600, paddingLeft: 0, background: 'transparent' }}
          onClick={addItem}
        >
          + Add item
        </button>
      </div>
    </div>
  );
};

export const ItemsSection = React.memo(
  ItemsSectionComponent,
  (prevProps, nextProps) => {
    return prevProps.items === nextProps.items &&
           prevProps.currency === nextProps.currency;
  }
);
