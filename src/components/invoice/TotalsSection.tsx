import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { InvoiceData } from '../../types/invoice';
import { formatCurrency } from '../../utils/currency';
import { isValidDecimalInput } from '../../utils/calculations';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useSettings } from '../../contexts/SettingsContext';
import { Select } from '../ui/Select';

interface TotalsSectionProps {
  data: InvoiceData;
  updateOtherFields: (updates: Partial<Pick<InvoiceData, 'notes' | 'terms' | 'paymentInstructions' | 'signatureUrl'>>) => void;
  setDiscount: (value: number | string, type: 'percent' | 'flat') => void;
  setTaxRate: (rate: number | string) => void;
  setTaxLabel: (label: string) => void;
  setShipping: (amount: number | string) => void;
  setAmountPaid: (amount: number | string) => void;
}

const TotalsSectionComponent: React.FC<TotalsSectionProps> = ({ 
  data, updateOtherFields, setDiscount, setTaxRate, setTaxLabel, setShipping, setAmountPaid 
}) => {
  const { currency } = data.details;
  const { totals } = data;
  const { settings } = useSettings();

  const [showTerms, setShowTerms] = useState(() => !!data.terms);
  const [showInstructions, setShowInstructions] = useState(() => !!data.paymentInstructions);

  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const symbol = getCurrencySymbol(currency);

  return (
    <div className="flex-col gap-6" style={{ width: '100%' }}>
      <div className="business-grid">
        {/* Left Side: Notes & Conditions */}
        <div className="flex-col gap-4">
          <Input 
            id="invoice-notes-input"
            label="Notes"
            multiline
            placeholder="Add a special note or thank you message for your client..."
            value={data.notes}
            onChange={(e) => updateOtherFields({ notes: e.target.value })}
          />

          {showTerms && (
            <div className="animate-fade-in" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}>
                <button 
                  onClick={() => { setShowTerms(false); updateOtherFields({ terms: '' }); }}
                  style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--space-1)' }}
                  className="hover-text-error"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <Input 
                id="invoice-terms-input"
                label="Terms & Conditions"
                multiline
                placeholder="e.g. Payment is due within 14 days"
                value={data.terms || ''}
                onChange={(e) => updateOtherFields({ terms: e.target.value })}
              />
            </div>
          )}

          {showInstructions && (
            <div className="animate-fade-in" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}>
                <button 
                  onClick={() => { setShowInstructions(false); updateOtherFields({ paymentInstructions: '' }); }}
                  style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--space-1)' }}
                  className="hover-text-error"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <Input 
                id="invoice-payment-instructions-input"
                label="Payment Instructions"
                multiline
                placeholder="e.g. Bank transfer details, PayPal email"
                value={data.paymentInstructions || ''}
                onChange={(e) => updateOtherFields({ paymentInstructions: e.target.value })}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            {!showTerms && (
              <Button variant="outline" size="sm" onClick={() => setShowTerms(true)}>
                {data.terms ? 'Edit terms' : '+ Add terms'}
              </Button>
            )}
            {!showInstructions && (
              <Button variant="outline" size="sm" onClick={() => setShowInstructions(true)}>
                {data.paymentInstructions ? 'Edit instructions' : '+ Payment instructions'}
              </Button>
            )}
          </div>
        </div>

        {/* Right Side: Totals Card & Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Adjustments Form */}
          <div className="flex-col gap-4" style={{ padding: 'var(--space-6)', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
            <div className="grid-2">
              <Input 
                id="discount-input"
                label="Discount"
                type="text"
                inputMode="decimal"
                value={totals.discountValue !== undefined ? totals.discountValue : ''}
                onChange={(e) => {
                  if (isValidDecimalInput(e.target.value)) setDiscount(e.target.value, totals.discountType);
                }}
                placeholder="0"
              />
              <Select
                label="Discount Type"
                value={totals.discountType}
                onChange={(v) => setDiscount(totals.discountValue, v as 'percent' | 'flat')}
                options={[
                  { value: 'percent', label: 'Percentage (%)' },
                  { value: 'flat', label: `Flat Amount (${symbol})` }
                ]}
              />
            </div>
            
            <div className="grid-2">
              <Input 
                id="tax-label-input"
                label="Tax Label"
                type="text"
                value={totals.taxLabel || settings.invoiceDefaults.defaultTaxLabel || 'Tax'}
                onChange={(e) => setTaxLabel(e.target.value)}
              />
              <Input 
                id="tax-rate-input"
                label="Tax Rate (%)"
                type="text"
                inputMode="decimal"
                value={totals.taxRate !== undefined ? totals.taxRate : ''}
                onChange={(e) => {
                  if (isValidDecimalInput(e.target.value)) setTaxRate(e.target.value);
                }}
                placeholder="0"
                rightIcon={<span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>%</span>}
              />
            </div>

            <div className="grid-2">
              <Input 
                id="shipping-input"
                label="Shipping"
                type="text"
                inputMode="decimal"
                value={totals.shipping !== undefined ? totals.shipping : ''}
                onChange={(e) => {
                  if (isValidDecimalInput(e.target.value)) setShipping(e.target.value);
                }}
                placeholder="0.00"
                leftIcon={<span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{symbol}</span>}
              />
              <Input 
                id="amount-paid-input"
                label="Amount Paid"
                type="text"
                value={totals.amountPaid !== undefined ? totals.amountPaid : ''}
                onChange={(e) => {
                  if (isValidDecimalInput(e.target.value)) setAmountPaid(e.target.value);
                }}
                placeholder="0.00"
                leftIcon={<span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{symbol}</span>}
              />
            </div>
          </div>

          {/* Totals Summary */}
          <div style={{
            background: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            width: '100%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              <span>Subtotal <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', fontWeight: 400 }}>({data.items.filter(i => i.name || Number(i.rate) > 0).length} item{data.items.filter(i => i.name || Number(i.rate) > 0).length !== 1 ? 's' : ''})</span></span>
              <span style={{ color: 'var(--color-text-title)', fontWeight: 600 }}>{formatCurrency(totals.subtotal, currency)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Discount
                  {totals.discountType === 'percent' && Number(totals.discountValue) > 0 && (
                    <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#16A34A', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      {totals.discountValue}% off
                    </span>
                  )}
                </span>
                <span style={{ color: '#16A34A', fontWeight: 600 }}>-{formatCurrency(totals.discountAmount, currency)}</span>
              </div>
            )}
            {totals.taxAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                <span>{totals.taxLabel || settings.invoiceDefaults.defaultTaxLabel || 'Tax'}</span>
                <span style={{ color: 'var(--color-text-title)', fontWeight: 600 }}>{formatCurrency(totals.taxAmount, currency)}</span>
              </div>
            )}
            {Number(totals.shipping) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--color-text-title)', fontWeight: 600 }}>{formatCurrency(Number(totals.shipping), currency)}</span>
              </div>
            )}
            
            <div style={{ borderTop: '1px dashed var(--color-border)', margin: '4px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', color: 'var(--color-text-title)', fontWeight: 600 }}>
              <span>Total</span>
              <span style={{ fontWeight: 700 }}>{formatCurrency(totals.total, currency)}</span>
            </div>

            {Number(totals.amountPaid) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                <span>Amount Paid</span>
                <span style={{ color: '#16A34A', fontWeight: 600 }}>-{formatCurrency(Number(totals.amountPaid), currency)}</span>
              </div>
            )}

            <div style={{
              background: '#0F172A',
              borderRadius: '12px',
              minHeight: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              marginTop: '8px',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
            }}>
              <span style={{ color: '#94A3B8', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Balance Due</span>
              <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.5px' }}>
                {formatCurrency(totals.balanceDue, currency)}
              </span>
            </div>
          </div>

        </div>
      </div>
      <style>{`
        .hover-text-error:hover { color: var(--color-error) !important; }
      `}</style>
    </div>
  );
};

export const TotalsSection = React.memo(
  TotalsSectionComponent,
  (prevProps, nextProps) => {
    return prevProps.data.totals === nextProps.data.totals &&
           prevProps.data.details.currency === nextProps.data.details.currency &&
           prevProps.data.notes === nextProps.data.notes &&
           prevProps.data.terms === nextProps.data.terms &&
           prevProps.data.paymentInstructions === nextProps.data.paymentInstructions &&
           prevProps.data.signatureUrl === nextProps.data.signatureUrl;
  }
);
