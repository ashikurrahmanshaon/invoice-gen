import React from 'react';
import { Copy, Trash2, Plus } from 'lucide-react';
import type { LineItem } from '../../types/invoice';
import { formatCurrency } from '../../utils/currency';
import { isValidDecimalInput, calculateLineAmount } from '../../utils/calculations';

interface ItemsSectionProps {
  items: LineItem[];
  currency: string;
  addItem: () => void;
  duplicateItem: (id: string) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<LineItem>) => void;
}

interface ItemRowProps {
  item: LineItem;
  currency: string;
  symbol: string;
  updateItem: (id: string, updates: Partial<LineItem>) => void;
  duplicateItem: (id: string) => void;
  removeItem: (id: string) => void;
}

const ItemRow = React.memo(({ item, currency, symbol, updateItem, duplicateItem, removeItem }: ItemRowProps) => {
  return (
    <div className="item-row-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(200px, 1.6fr) minmax(190px, 1.5fr) 110px 80px 110px 72px',
      gap: '16px',
      alignItems: 'center',
      minHeight: '64px',
      borderBottom: '1px solid #EAECF0',
      padding: '12px 0',
      transition: 'background-color var(--transition-fast)'
    }}>
      {/* Item Name */}
      <div>
        <input 
          type="text" 
          placeholder="Item or service name"
          aria-label="Item or service name"
          value={item.name}
          onChange={(e) => updateItem(item.id, { name: e.target.value })}
        />
      </div>

      {/* Description */}
      <div>
        <input 
          type="text" 
          placeholder="Description (optional)"
          aria-label="Description"
          value={item.description}
          onChange={(e) => updateItem(item.id, { description: e.target.value })}
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
          <input 
            type="text"
            inputMode="decimal"
            placeholder="0.00"
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

      {/* Qty (Centered input) */}
      <div>
        <input 
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

      {/* Amount (Bold & Right-aligned) */}
      <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '14px', color: 'var(--color-text-main)', paddingRight: '4px' }}>
        {formatCurrency(calculateLineAmount(item.rate, item.quantity), currency)}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => duplicateItem(item.id)}
          className="btn-ghost btn-icon btn-action-dup"
          aria-label="Duplicate item"
          title="Duplicate item"
        >
          <Copy size={16} />
        </button>
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

export const ItemsSection: React.FC<ItemsSectionProps> = ({ 
  items, currency, addItem, duplicateItem, removeItem, updateItem 
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
    <div data-testid="items-section" className="flex-col gap-5" style={{ width: '100%', borderBottom: '1px solid #EAECF0', paddingBottom: '28px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
        <span className="step-badge">03</span>
        <div className="flex-col">
          <h3 className="font-bold text-base" style={{ lineHeight: 1.2, margin: 0, color: 'var(--color-text-main)' }}>Items</h3>
          <span className="text-xs text-secondary">Add products or services.</span>
        </div>
      </div>

      {/* Grid Table Container */}
      <div style={{ width: '100%', marginTop: 'var(--space-2)' }} className="items-section-wrapper">
        <div className="items-table-container" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header Row */}
          <div className="items-header-row" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 1.6fr) minmax(190px, 1.5fr) 110px 80px 110px 72px',
            gap: '16px',
            borderBottom: '1px solid #EAECF0',
            padding: '12px 0',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: 600
          }}>
            <div>Item or service</div>
            <div>Description</div>
            <div>Rate</div>
            <div style={{ textAlign: 'center' }}>Qty</div>
            <div style={{ textAlign: 'right' }}>Amount</div>
            <div></div>
          </div>

          {/* Body Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((item) => (
              <ItemRow 
                key={item.id}
                item={item}
                currency={currency}
                symbol={symbol}
                updateItem={updateItem}
                duplicateItem={duplicateItem}
                removeItem={removeItem}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Add Line Item Button */}
      <div style={{ display: 'flex' }}>
        <button 
          className="btn btn-outline text-primary" 
          onClick={addItem}
        >
          <Plus size={16} /> Add Line Item
        </button>
      </div>
    </div>
  );
};
