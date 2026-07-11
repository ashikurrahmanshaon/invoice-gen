import React, { useState } from 'react';
import { Trash2, ChevronUp } from 'lucide-react';
import type { InvoiceData } from '../../types/invoice';
import { formatCurrency } from '../../utils/currency';
import { isValidDecimalInput } from '../../utils/calculations';

interface TotalsSectionProps {
  data: InvoiceData;
  updateOtherFields: (updates: Partial<Pick<InvoiceData, 'notes' | 'terms' | 'paymentInstructions' | 'signatureUrl'>>) => void;
  setDiscount: (value: number | string, type: 'percent' | 'flat') => void;
  setTaxRate: (rate: number | string) => void;
  setTaxLabel: (label: string) => void;
  setShipping: (amount: number | string) => void;
  setAmountPaid: (amount: number | string) => void;
}

export const TotalsSection: React.FC<TotalsSectionProps> = ({ 
  data, updateOtherFields, setDiscount, setTaxRate, setTaxLabel, setShipping, setAmountPaid 
}) => {
  const { currency } = data.details;
  const { totals } = data;

  const [showTerms, setShowTerms] = useState(() => !!data.terms);
  const [showInstructions, setShowInstructions] = useState(() => !!data.paymentInstructions);

  // Toggle calculations rows
  const [enableDiscount, setEnableDiscount] = useState(() => Number(totals.discountValue) > 0 || totals.discountAmount > 0);
  const [enableTax, setEnableTax] = useState(() => Number(totals.taxRate) > 0 || totals.taxAmount > 0);
  const [enableShipping, setEnableShipping] = useState(() => Number(totals.shipping) > 0);

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
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
        <span className="step-badge">04</span>
        <div className="flex-col">
          <h3 className="font-bold text-base" style={{ lineHeight: 1.2, margin: 0, color: 'var(--color-text-main)' }}>Review & finish</h3>
          <span className="text-xs text-secondary">Add notes and check the final amount.</span>
        </div>
      </div>

      <div className="business-grid">
        {/* Left Side: Notes & Conditions */}
        <div className="flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '8px' }}>Notes</label>
            <textarea 
              placeholder="Thank you for your business."
              value={data.notes}
              onChange={(e) => updateOtherFields({ notes: e.target.value })}
              style={{ height: '128px', maxHeight: '128px', resize: 'none', width: '100%' }}
            />
          </div>

          {showTerms && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="text-xs font-semibold text-secondary">Terms & Conditions</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setShowTerms(false)}
                    style={{ color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                    title="Collapse"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button 
                    onClick={() => { setShowTerms(false); updateOtherFields({ terms: '' }); }}
                    style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                    className="hover-text-error"
                    title="Clear"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <textarea 
                placeholder="e.g. Payment is due within 14 days"
                value={data.terms || ''}
                onChange={(e) => updateOtherFields({ terms: e.target.value })}
                style={{ height: '80px', resize: 'vertical', width: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
              />
            </div>
          )}

          {showInstructions && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="text-xs font-semibold text-secondary">Payment Instructions</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setShowInstructions(false)}
                    style={{ color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                    title="Collapse"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button 
                    onClick={() => { setShowInstructions(false); updateOtherFields({ paymentInstructions: '' }); }}
                    style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                    className="hover-text-error"
                    title="Clear"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <textarea 
                placeholder="e.g. Bank transfer details, PayPal email"
                value={data.paymentInstructions || ''}
                onChange={(e) => updateOtherFields({ paymentInstructions: e.target.value })}
                style={{ height: '80px', resize: 'vertical', width: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
              />
            </div>
          )}

          {/* Secondary Buttons Row */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {!showTerms && (
              <button 
                className="btn btn-outline text-xs" 
                style={{ minHeight: '36px', height: '36px', padding: '0 12px', fontWeight: 500 }}
                onClick={() => setShowTerms(true)}
              >
                {data.terms ? 'Edit terms' : '+ Add terms'}
              </button>
            )}
            {!showInstructions && (
              <button 
                className="btn btn-outline text-xs" 
                style={{ minHeight: '36px', height: '36px', padding: '0 12px', fontWeight: 500 }}
                onClick={() => setShowInstructions(true)}
              >
                {data.paymentInstructions ? 'Edit instructions' : '+ Payment instructions'}
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Totals Card */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E4E7EC',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%'
        }}>
          {/* Subtotal Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px', color: 'var(--color-text-main)', fontWeight: 500 }}>
            <span>Subtotal</span>
            <div></div>
            <div></div>
            <span style={{ textAlign: 'right' }}>{formatCurrency(totals.subtotal, currency)}</span>
          </div>

          {/* Discount Row */}
          {enableDiscount ? (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
              <span className="text-secondary">Discount</span>
              <div style={{ justifySelf: 'start', display: 'flex', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'white', overflow: 'hidden', height: '32px', width: '92px' }}>
                <input 
                  type="text" 
                  value={totals.discountValue !== undefined ? totals.discountValue : ''}
                  onChange={(e) => {
                    if (isValidDecimalInput(e.target.value)) setDiscount(e.target.value, totals.discountType);
                  }}
                  style={{ border: 'none', padding: '0 6px', width: '100%', minWidth: 0, textAlign: 'right', minHeight: 'auto', height: '100%', fontSize: '12px', background: 'none', outline: 'none' }}
                  placeholder="0"
                />
                <select 
                  value={totals.discountType}
                  onChange={(e) => setDiscount(totals.discountValue, e.target.value as 'percent' | 'flat')}
                  style={{ border: 'none', borderLeft: '1px solid var(--color-border)', background: '#F8FAFC', fontSize: '11px', height: '100%', padding: '0 4px', width: '38px', minHeight: 'auto', borderRadius: 0, flexShrink: 0 }}
                >
                  <option value="percent">%</option>
                  <option value="flat">{symbol}</option>
                </select>
              </div>
              <button 
                onClick={() => { setEnableDiscount(false); setDiscount(0, 'percent'); }} 
                style={{ justifySelf: 'center', color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}
                className="hover-text-error"
              >
                <Trash2 size={14} />
              </button>
              <span className="font-medium text-secondary" style={{ textAlign: 'right' }}>
                -{formatCurrency(totals.discountAmount, currency)}
              </span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px', height: '32px' }}>
              <span className="text-secondary">Discount</span>
              <button 
                className="text-primary" 
                style={{ justifySelf: 'start', padding: 0, minHeight: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                onClick={() => setEnableDiscount(true)}
              >
                + Add discount
              </button>
              <div></div>
              <div></div>
            </div>
          )}

          {/* Tax Row */}
          {enableTax ? (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
              <input 
                type="text" 
                className="text-secondary font-medium"
                value={totals.taxLabel || ''}
                onChange={(e) => setTaxLabel(e.target.value)}
                onBlur={(e) => {
                  const trimmed = e.target.value.trim();
                  if (!trimmed) setTaxLabel('Tax');
                  else setTaxLabel(trimmed);
                }}
                maxLength={15}
                placeholder="Tax"
                style={{ border: '1px solid transparent', background: 'transparent', outline: 'none', padding: 0, margin: 0, width: '100%', fontSize: '14px' }}
              />
              <div style={{ justifySelf: 'start', display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'white', overflow: 'hidden', height: '32px', width: '92px' }}>
                <input 
                  type="text" 
                  value={totals.taxRate !== undefined ? totals.taxRate : ''}
                  onChange={(e) => {
                    if (isValidDecimalInput(e.target.value)) setTaxRate(e.target.value);
                  }}
                  style={{ border: 'none', padding: '0 6px', width: '100%', minWidth: 0, textAlign: 'right', minHeight: 'auto', height: '100%', fontSize: '12px', background: 'none', outline: 'none' }}
                  placeholder="0"
                />
                <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', paddingRight: '8px', background: 'white', userSelect: 'none' }}>%</span>
              </div>
              <button 
                onClick={() => { setEnableTax(false); setTaxRate(0); }} 
                style={{ justifySelf: 'center', color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}
                className="hover-text-error"
              >
                <Trash2 size={14} />
              </button>
              <span className="font-medium text-secondary" style={{ textAlign: 'right' }}>
                {formatCurrency(totals.taxAmount, currency)}
              </span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px', height: '32px' }}>
              <span className="text-secondary">Tax</span>
              <button 
                className="text-primary" 
                style={{ justifySelf: 'start', padding: 0, minHeight: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                onClick={() => setEnableTax(true)}
              >
                + Add tax
              </button>
              <div></div>
              <div></div>
            </div>
          )}

          {/* Shipping Row */}
          {enableShipping ? (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
              <span className="text-secondary">Shipping</span>
              <div style={{ justifySelf: 'start', position: 'relative', width: '92px', height: '32px' }}>
                <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }}>{symbol}</span>
                <input 
                  type="text" 
                  value={totals.shipping !== undefined ? totals.shipping : ''}
                  onChange={(e) => {
                    if (isValidDecimalInput(e.target.value)) setShipping(e.target.value);
                  }}
                  style={{ border: '1px solid var(--color-border)', padding: '0 6px 0 16px', width: '100%', minHeight: 'auto', height: '100%', fontSize: '12px', borderRadius: '6px', textAlign: 'right', outline: 'none' }}
                  placeholder="0.00"
                />
              </div>
              <button 
                onClick={() => { setEnableShipping(false); setShipping(0); }} 
                style={{ justifySelf: 'center', color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}
                className="hover-text-error"
              >
                <Trash2 size={14} />
              </button>
              <span className="font-medium text-secondary" style={{ textAlign: 'right' }}>
                {formatCurrency(Number(totals.shipping), currency)}
              </span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '14px', height: '32px' }}>
              <span className="text-secondary">Shipping</span>
              <button 
                className="text-primary" 
                style={{ justifySelf: 'start', padding: 0, minHeight: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                onClick={() => setEnableShipping(true)}
              >
                + Add shipping
              </button>
              <div></div>
              <div></div>
            </div>
          )}

          <div style={{ borderTop: '1px solid #E4E7EC', margin: '4px 0' }} />

          {/* Total Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '15px', color: 'var(--color-text-main)', fontWeight: 600 }}>
            <span>Total</span>
            <div></div>
            <div></div>
            <span style={{ textAlign: 'right' }}>{formatCurrency(totals.total, currency)}</span>
          </div>

          {/* Amount Paid Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 24px 92px', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
            <span className="text-secondary">Amount Paid</span>
            <div></div>
            <div></div>
            <div style={{ justifySelf: 'end', position: 'relative', width: '92px', height: '32px' }}>
              <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }}>{symbol}</span>
              <input 
                type="text" 
                value={totals.amountPaid !== undefined ? totals.amountPaid : ''}
                onChange={(e) => {
                  if (isValidDecimalInput(e.target.value)) setAmountPaid(e.target.value);
                }}
                style={{ border: '1px solid var(--color-border)', padding: '0 6px 0 16px', width: '100%', minHeight: 'auto', height: '100%', fontSize: '12px', borderRadius: '6px', textAlign: 'right', outline: 'none' }}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Balance Due Block (Soft blue, 56px height, large text) */}
          <div style={{
            background: '#EEF4FF',
            border: '1px solid rgba(21, 94, 239, 0.2)',
            borderRadius: '8px',
            minHeight: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            marginTop: '8px'
          }}>
            <span style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: '14px' }}>Balance Due</span>
            <span style={{ color: '#155EEF', fontWeight: 800, fontSize: '20px' }}>
              {formatCurrency(totals.balanceDue, currency)}
            </span>
          </div>
        </div>
      </div>
      <style>{`
        .hover-text-error:hover { color: var(--color-error) !important; }
      `}</style>
    </div>
  );
};
