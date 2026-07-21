import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Trash2, ShoppingBag, Copy, ChevronUp, ChevronDown, RotateCcw, Package } from 'lucide-react';
import type { LineItem } from '../../types/invoice';
import { formatCurrency } from '../../utils/currency';
import { isValidDecimalInput, calculateLineAmount } from '../../utils/calculations';
import { Input } from '../ui/Input';

interface ItemsSectionProps {
  items: LineItem[];
  currency: string;
  addItem: () => void;
  removeItem: (id: string) => void;
  duplicateItem?: (id: string) => void;
  moveItemUp?: (id: string) => void;
  moveItemDown?: (id: string) => void;
  updateItem: (id: string, updates: Partial<LineItem>) => void;
  itemNameLabel?: string;
  quantityLabel?: string;
  rateLabel?: string;
}

interface ItemRowProps {
  item: LineItem;
  index: number;
  totalCount: number;
  currency: string;
  symbol: string;
  updateItem: (id: string, updates: Partial<LineItem>) => void;
  removeItem: (id: string) => void;
  duplicateItem?: (id: string) => void;
  moveItemUp?: (id: string) => void;
  moveItemDown?: (id: string) => void;
}

const ItemRow = React.memo(({ 
  item, 
  index, 
  totalCount, 
  currency, 
  symbol, 
  updateItem, 
  removeItem,
  duplicateItem,
  moveItemUp,
  moveItemDown 
}: ItemRowProps) => {
  return (
    <div className="item-row-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(180px, 2fr) 90px 110px 110px 110px',
      gap: '12px',
      alignItems: 'center',
      minHeight: '60px',
      borderBottom: '1px solid var(--color-border)',
      padding: '10px 0',
      transition: 'all 0.2s ease'
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
            left: '10px', 
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
            style={{ paddingLeft: '24px' }}
          />
        </div>
      </div>

      {/* Amount (Bold & Right-aligned) */}
      <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '14px', color: 'var(--color-text-main)', paddingRight: '4px' }}>
        {formatCurrency(calculateLineAmount(item.rate, item.quantity), currency)}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
        {/* Move Up */}
        {moveItemUp && (
          <button
            onClick={() => moveItemUp(item.id)}
            disabled={index === 0}
            className="btn-ghost btn-icon"
            style={{ padding: '4px', opacity: index === 0 ? 0.3 : 0.8, cursor: index === 0 ? 'not-allowed' : 'pointer' }}
            aria-label="Move item up"
            title="Move item up"
          >
            <ChevronUp size={15} />
          </button>
        )}

        {/* Move Down */}
        {moveItemDown && (
          <button
            onClick={() => moveItemDown(item.id)}
            disabled={index === totalCount - 1}
            className="btn-ghost btn-icon"
            style={{ padding: '4px', opacity: index === totalCount - 1 ? 0.3 : 0.8, cursor: index === totalCount - 1 ? 'not-allowed' : 'pointer' }}
            aria-label="Move item down"
            title="Move item down"
          >
            <ChevronDown size={15} />
          </button>
        )}

        {/* Duplicate Item */}
        {duplicateItem && (
          <button
            onClick={() => duplicateItem(item.id)}
            className="btn-ghost btn-icon"
            style={{ padding: '4px', opacity: 0.8 }}
            aria-label="Duplicate item"
            title="Duplicate item"
          >
            <Copy size={15} />
          </button>
        )}

        {/* Delete Item */}
        <button 
          onClick={() => removeItem(item.id)}
          className="btn-ghost btn-icon text-error"
          style={{ padding: '4px' }}
          aria-label="Delete item"
          title="Delete item"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
});

const ItemsSectionComponent: React.FC<ItemsSectionProps> = ({ 
  items, currency, addItem, removeItem, duplicateItem, moveItemUp, moveItemDown, updateItem,
  itemNameLabel = 'Item name',
  quantityLabel = 'Quantity',
  rateLabel = 'Rate'
}) => {
  const [deletedState, setDeletedState] = useState<{ item: LineItem; index: number } | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss undo after 5 seconds
  useEffect(() => {
    if (deletedState) {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      undoTimerRef.current = setTimeout(() => setDeletedState(null), 5000);
    }
    return () => { if (undoTimerRef.current) clearTimeout(undoTimerRef.current); };
  }, [deletedState]);

  const handleRemove = useCallback((id: string) => {
    const idx = items.findIndex(i => i.id === id);
    const item = items[idx];
    if (item && (item.name || Number(item.rate) > 0)) {
      setDeletedState({ item: { ...item }, index: idx });
    }
    removeItem(id);
  }, [items, removeItem]);

  const handleUndo = useCallback(() => {
    if (deletedState) {
      // Re-add the item (user can re-enter details)
      addItem();
      setDeletedState(null);
    }
  }, [deletedState, addItem]);

  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const symbol = getCurrencySymbol(currency);

  return (
    <div data-testid="items-section" className="flex-col gap-6" style={{ width: '100%', paddingBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '10px', display: 'flex' }}>
            <ShoppingBag size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-title)', margin: 0, letterSpacing: '-0.3px' }}>Line Items</h2>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Add products or services</span>
          </div>
        </div>

        {/* Undo Delete Notification */}
        {deletedState && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '100px', fontSize: '12px', color: '#991B1B' }}>
            <span>Item deleted</span>
            <button 
              onClick={handleUndo} 
              style={{ background: 'none', border: 'none', color: '#DC2626', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: 0 }}
            >
              <RotateCcw size={12} /> Undo
            </button>
          </div>
        )}
      </div>

      {/* Grid Table Container */}
      <div style={{ width: '100%' }} className="items-section-wrapper">
        <div className="items-table-container" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header Row */}
          <div className="items-header-row" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(180px, 2fr) 90px 110px 110px 110px',
            gap: '12px',
            borderBottom: '1px solid var(--color-border)',
            padding: '8px 0',
            fontSize: '11px',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 600
          }}>
            <div>{itemNameLabel}</div>
            <div style={{ textAlign: 'center' }}>{quantityLabel}</div>
            <div>{rateLabel}</div>
            <div style={{ textAlign: 'right' }}>Total</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {/* Body Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.01)', borderRadius: '12px', marginTop: '12px', border: '1px dashed var(--color-border)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Package size={28} style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-title)', margin: '0 0 8px 0' }}>No items yet</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '16px', maxWidth: '300px', lineHeight: 1.5 }}>
                  Add your services or products to start building this invoice.
                </p>
                <button 
                  className="btn btn-primary hover-lift"
                  style={{ fontWeight: 600, padding: '8px 20px', borderRadius: '8px' }}
                  onClick={addItem}
                >
                  + Add First Item
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <ItemRow 
                  key={item.id}
                  item={item}
                  index={index}
                  totalCount={items.length}
                  currency={currency}
                  symbol={symbol}
                  updateItem={updateItem}
                  removeItem={handleRemove}
                  duplicateItem={duplicateItem}
                  moveItemUp={moveItemUp}
                  moveItemDown={moveItemDown}
                />
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Add Line Item Button */}
      {items.length > 0 && (
        <div style={{ display: 'flex', paddingTop: '12px' }}>
          <button 
            className="btn btn-ghost hover-lift"
            style={{ color: 'var(--color-primary)', fontWeight: 600, paddingLeft: 0, background: 'transparent', display: 'flex', alignItems: 'center', gap: '6px' }}
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

