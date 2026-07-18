import React, { useMemo } from 'react';
import type { InvoiceData } from '../../../types/invoice';
import { formatCurrency, formatDate } from '../../../utils/currency';
import { formatAddress } from '../../../utils/addressFormatter';
import { calculateLineAmount, sanitizeNumber } from '../../../utils/calculations';
import { useTranslation } from 'react-i18next';

export const PremiumLayout = React.memo(({ data }: { data: InvoiceData }) => {
  const { t } = useTranslation();
  
  // Default to a professional deep navy/emerald if no theme color is provided
  const themeColor = data.details.themeColor || '#0F172A'; 
  const lightThemeColor = `${themeColor}15`; // 15% opacity hex
  const mutedTextColor = '#64748B';
  const borderStyle = `1px solid #E2E8F0`;

  const businessAddressLines = useMemo(() => formatAddress(data.business), [data.business]);
  const clientAddressLines = useMemo(() => formatAddress(data.client), [data.client]);

  return (
    <div style={{ 
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif', 
      color: '#0F172A',
      position: 'relative',
      minHeight: '100%',
      backgroundColor: '#ffffff'
    }}>
      {/* Top Accent Bar */}
      <div style={{ height: '8px', width: '100%', backgroundColor: themeColor, marginBottom: '40px' }} />

      <div style={{ padding: '0 48px' }}>
        {/* Header: Logo and Invoice Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
          <div style={{ flex: 1, maxWidth: '50%' }}>
            {data.business.logoUrl ? (
              <img 
                src={data.business.logoUrl} 
                crossOrigin="anonymous" 
                alt="Business Logo" 
                style={{ maxHeight: '80px', maxWidth: '200px', objectFit: 'contain', marginBottom: '24px' }} 
              />
            ) : (
              <div style={{ fontSize: '28px', fontWeight: 800, color: themeColor, marginBottom: '24px', letterSpacing: '-0.5px' }}>
                {data.business.name || 'YOUR COMPANY'}
              </div>
            )}
            
            {/* If there was a logo, still print company name if desired, or just address */}
            {data.business.logoUrl && data.business.name && (
               <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                 {data.business.name}
               </div>
            )}
            
            <div style={{ fontSize: '13px', lineHeight: 1.6, color: mutedTextColor }}>
              {businessAddressLines.map((line, idx) => <div key={idx}>{line}</div>)}
              {data.business.email && <div>{data.business.email}</div>}
              {data.business.phone && <div>{data.business.phone}</div>}
              {data.business.taxId && <div style={{ marginTop: '4px' }}>{t('tax_id_label', 'Tax ID:')} {data.business.taxId}</div>}
            </div>
          </div>
          
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ 
              fontSize: '42px', 
              fontWeight: 800, 
              color: '#0F172A', 
              letterSpacing: '-1px', 
              textTransform: 'uppercase',
              marginBottom: '8px',
              lineHeight: 1
            }}>
              {data.documentLabels?.title || t('invoice_title', 'INVOICE')}
            </div>
            <div style={{ fontSize: '14px', color: mutedTextColor, fontWeight: 500, marginBottom: '24px' }}>
              {data.documentLabels?.numberPrefix ? `${data.documentLabels.numberPrefix} ${data.details.invoiceNumber}` : `#${data.details.invoiceNumber}`}
            </div>

            <div style={{ display: 'inline-grid', gridTemplateColumns: 'auto auto', gap: '12px 24px', textAlign: 'right', fontSize: '13px' }}>
              <div style={{ color: mutedTextColor, fontWeight: 500 }}>{data.documentLabels?.date || t('issue_date_label', 'Issue Date')}</div>
              <div style={{ fontWeight: 600 }}>{formatDate(data.details.issueDate)}</div>
              
              {data.details.dueDate && (
                <>
                  <div style={{ color: mutedTextColor, fontWeight: 500 }}>{data.documentLabels?.dueDate || t('due_date_label', 'Due Date')}</div>
                  <div style={{ fontWeight: 600 }}>{formatDate(data.details.dueDate)}</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#E2E8F0', marginBottom: '40px' }} />

        {/* Bill To */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: mutedTextColor, fontWeight: 600, marginBottom: '12px' }}>
            {data.documentLabels?.billTo || t('bill_to_label', 'Billed To')}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#0F172A' }}>
            {data.client.name || '\u00A0'}
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.6, color: mutedTextColor }}>
            {clientAddressLines.map((line, idx) => <div key={idx}>{line}</div>)}
            {data.client.email && <div>{data.client.email}</div>}
            {data.client.phone && <div>{data.client.phone}</div>}
            {data.client.taxId && <div style={{ marginTop: '4px' }}>{t('tax_id_label', 'Tax ID:')} {data.client.taxId}</div>}
          </div>
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: '48px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 600, color: '#0F172A', backgroundColor: '#F8FAFC', borderBottom: borderStyle, borderTop: borderStyle }}>{t('description_header', 'Description')}</th>
                <th style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 600, color: '#0F172A', backgroundColor: '#F8FAFC', borderBottom: borderStyle, borderTop: borderStyle, width: '15%' }}>{t('price_header', 'Price')}</th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: 600, color: '#0F172A', backgroundColor: '#F8FAFC', borderBottom: borderStyle, borderTop: borderStyle, width: '10%' }}>{t('qty_header', 'Qty')}</th>
                <th style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 600, color: '#0F172A', backgroundColor: '#F8FAFC', borderBottom: borderStyle, borderTop: borderStyle, width: '20%' }}>{t('total_header', 'Total')}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td style={{ padding: '20px', verticalAlign: 'top', borderBottom: borderStyle }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>{item.name || '\u00A0'}</div>
                    {item.description && <div style={{ marginTop: '6px', color: mutedTextColor, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{item.description}</div>}
                  </td>
                  <td style={{ padding: '20px', verticalAlign: 'top', textAlign: 'right', borderBottom: borderStyle, color: '#334155' }}>
                    {formatCurrency(sanitizeNumber(item.rate), data.details.currency)}
                  </td>
                  <td style={{ padding: '20px', verticalAlign: 'top', textAlign: 'center', borderBottom: borderStyle, color: '#334155' }}>
                    {sanitizeNumber(item.quantity)}
                  </td>
                  <td style={{ padding: '20px', verticalAlign: 'top', textAlign: 'right', borderBottom: borderStyle, fontWeight: 600, color: '#0F172A' }}>
                    {formatCurrency(calculateLineAmount(item.rate, item.quantity), data.details.currency)}
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '40px 20px', textAlign: 'center', color: mutedTextColor, fontStyle: 'italic', borderBottom: borderStyle }}>
                    No items added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '64px' }}>
          <div style={{ width: '380px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', color: '#334155', fontSize: '14px' }}>
              <span>{t('subtotal_label', 'Subtotal')}</span>
              <span style={{ fontWeight: 500 }}>{formatCurrency(data.totals.subtotal, data.details.currency)}</span>
            </div>
            
            {data.totals.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', color: '#334155', fontSize: '14px' }}>
                <span>{t('discount_label', 'Discount')}</span>
                <span style={{ color: '#EF4444' }}>-{formatCurrency(data.totals.discountAmount, data.details.currency)}</span>
              </div>
            )}
            
            {Number(data.totals.taxRate) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', color: '#334155', fontSize: '14px' }}>
                <span>{data.totals.taxLabel || t('tax_label', 'Tax')} ({sanitizeNumber(data.totals.taxRate)}%)</span>
                <span>{formatCurrency(data.totals.taxAmount, data.details.currency)}</span>
              </div>
            )}
            
            {Number(data.totals.shipping) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', color: '#334155', fontSize: '14px' }}>
                <span>{t('shipping_label', 'Shipping')}</span>
                <span>{formatCurrency(sanitizeNumber(data.totals.shipping), data.details.currency)}</span>
              </div>
            )}
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '20px', 
              backgroundColor: lightThemeColor, 
              borderRadius: '8px',
              marginTop: '12px',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 700, fontSize: '16px', color: themeColor }}>{t('total_label', 'Total Due')}</span>
              <span style={{ fontWeight: 800, fontSize: '24px', color: themeColor }}>{formatCurrency(data.totals.balanceDue, data.details.currency)}</span>
            </div>

            {Number(data.totals.amountPaid) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px 0', color: mutedTextColor, fontSize: '13px' }}>
                <span>{t('amount_paid_label', 'Amount Paid')}</span>
                <span>{formatCurrency(sanitizeNumber(data.totals.amountPaid), data.details.currency)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer info: Notes, Terms, Signature */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '48px', breakInside: 'avoid' }}>
          <div style={{ flex: 1 }}>
            {data.paymentInstructions && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: mutedTextColor, fontWeight: 600, marginBottom: '8px' }}>
                  {t('payment_instructions_label', 'Payment Instructions')}
                </div>
                <div style={{ fontSize: '13px', color: '#0F172A', whiteSpace: 'pre-wrap', lineHeight: 1.6, backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: borderStyle }}>
                  {data.paymentInstructions}
                </div>
              </div>
            )}
            
            {data.notes && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: mutedTextColor, fontWeight: 600, marginBottom: '8px' }}>
                  {t('notes_label', 'Notes')}
                </div>
                <div style={{ fontSize: '13px', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {data.notes}
                </div>
              </div>
            )}

            {data.terms && (
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: mutedTextColor, fontWeight: 600, marginBottom: '8px' }}>
                  {t('terms_label', 'Terms & Conditions')}
                </div>
                <div style={{ fontSize: '12px', color: mutedTextColor, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {data.terms}
                </div>
              </div>
            )}
          </div>

          <div style={{ width: '250px', textAlign: 'center' }}>
            {data.signatureUrl ? (
              <div style={{ marginTop: '24px' }}>
                <img src={data.signatureUrl} crossOrigin="anonymous" alt="Signature" style={{ maxHeight: '80px', maxWidth: '200px', objectFit: 'contain', marginBottom: '8px' }} />
                <div style={{ borderTop: '1px solid #CBD5E1', paddingTop: '8px', fontSize: '13px', color: mutedTextColor, fontWeight: 500 }}>
                  {t('authorized_signature', 'Authorized Signature')}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '80px', borderTop: '1px solid #CBD5E1', paddingTop: '8px', fontSize: '13px', color: mutedTextColor, fontWeight: 500 }}>
                {t('authorized_signature', 'Authorized Signature')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
PremiumLayout.displayName = 'PremiumLayout';
