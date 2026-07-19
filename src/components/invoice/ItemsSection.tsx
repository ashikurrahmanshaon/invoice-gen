import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
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
    <div data-testid="items-section" className="flex-col gap-6" style={{ width: '100%', paddingBottom: '32px', borderBottom: '1px solid var(--color-border)' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '16px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '16px', display: 'flex' }}>
          <ShoppingBag size={28} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-title)', margin: 0, letterSpacing: '-0.5px' }}>Line Items</h2>
          <span style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Add products or services</span>
        </div>
      </div>

      {/* Grid Table Container */}
      <div style={{ width: '100%' }} className="items-section-wrapper">
        <div className="items-table-container" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header Row */}
          <div className="items-header-row" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 2fr) 100px 120px 120px 48px',
            gap: '16px',
            borderBottom: '1px solid var(--color-border)',
            padding: '8px 16px',
            fontSize: '11px',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 500
          }}>
            <div>Item name</div>
            <div style={{ textAlign: 'center' }}>Quantity</div>
            <div>Rate</div>
            <div style={{ textAlign: 'right' }}>Total</div>
            <div></div>
          </div>

          {/* Body Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px' }}>
            {items.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.01)', borderRadius: '12px', marginTop: '16px', border: '1px dashed var(--color-border)' }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '16px', maxWidth: '300px', lineHeight: 1.5 }}>
                  No items added yet. Add your services or products to this invoice.
                </p>
                <button 
                  className="btn btn-primary hover-lift"
                  style={{ fontWeight: 600, padding: '8px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}
                  onClick={addItem}
                >
                  + Add First Item
                </button>
              </div>
            ) : (
              items.map((item) => (
                <ItemRow 
                  key={item.id}
                  item={item}
                  currency={currency}
                  symbol={symbol}
                  updateItem={updateItem}
                  removeItem={removeItem}
                />
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Add Line Item Button */}
      {items.length > 0 && (
        <div style={{ display: 'flex', padding: '0 16px' }}>
          <button 
            className="btn btn-ghost hover-lift"
            style={{ color: '#2563EB', fontWeight: 600, paddingLeft: 0, background: 'transparent' }}
            onClick={addItem}
          >
            + Add item
          </button>
        </div>
      )}
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
