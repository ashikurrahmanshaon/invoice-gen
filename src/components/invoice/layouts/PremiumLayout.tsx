import React, { useMemo } from 'react';
import type { InvoiceData } from '../../../types/invoice';
import { formatCurrency, formatDate } from '../../../utils/currency';
import { formatAddress } from '../../../utils/addressFormatter';
import { calculateLineAmount, sanitizeNumber } from '../../../utils/calculations';
import { useTranslation } from 'react-i18next';

export const PremiumLayout = React.memo(({ data }: { data: InvoiceData }) => {
  const { t } = useTranslation();
  
  // Minimalist, Black & White Corporate Design
  const mainTextColor = '#000000'; 
  const mutedTextColor = '#555555';
  const lightBorder = `1px solid #DDDDDD`;
  const darkBorder = `1px solid #000000`;

  const businessAddressLines = useMemo(() => formatAddress(data.business), [data.business]);
  const clientAddressLines = useMemo(() => formatAddress(data.client), [data.client]);
  
  // Compact mode for invoices with many items to ensure they fit on one page
  const isCompact = data.items.length > 4;

  return (
    <div style={{ 
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
      color: mainTextColor,
      position: 'relative',
      minHeight: '100%',
      backgroundColor: '#ffffff'
    }}>
      <div style={{ padding: isCompact ? '16px 32px' : '24px 48px' }}>
        
        {/* Header: Logo and Invoice Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isCompact ? '20px' : '40px' }}>
          <div style={{ flex: 1, maxWidth: '50%' }}>
            {data.business.logoUrl ? (
              <img 
                src={data.business.logoUrl} 
                crossOrigin="anonymous" 
                alt="Business Logo" 
                style={{ maxHeight: isCompact ? '50px' : '70px', maxWidth: '200px', objectFit: 'contain', marginBottom: '12px', filter: 'grayscale(100%)' }} 
              />
            ) : (
              <div style={{ fontSize: isCompact ? '20px' : '24px', fontWeight: 700, color: mainTextColor, marginBottom: '12px', letterSpacing: '-0.5px' }}>
                {data.business.name || 'YOUR COMPANY'}
              </div>
            )}
            
            {data.business.logoUrl && data.business.name && (
               <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
                 {data.business.name}
               </div>
            )}
            
            <div style={{ fontSize: '12px', lineHeight: 1.5, color: mutedTextColor }}>
              {businessAddressLines.map((line, idx) => <div key={idx}>{line}</div>)}
              {data.business.email && <div>{data.business.email}</div>}
              {data.business.phone && <div>{data.business.phone}</div>}
              {data.business.taxId && <div style={{ marginTop: '4px' }}>{t('tax_id_label', 'Tax ID:')} {data.business.taxId}</div>}
            </div>
          </div>
          
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 400, 
              color: mainTextColor, 
              letterSpacing: '4px', 
              textTransform: 'uppercase',
              marginBottom: '8px',
              lineHeight: 1
            }}>
              {data.documentLabels?.title || t('invoice_title', 'INVOICE')}
            </div>
            <div style={{ fontSize: '14px', color: mutedTextColor, fontWeight: 400, marginBottom: isCompact ? '12px' : '24px' }}>
              {data.documentLabels?.numberPrefix ? `${data.documentLabels.numberPrefix} ${data.details.invoiceNumber}` : `#${data.details.invoiceNumber}`}
            </div>

            <div style={{ display: 'inline-grid', gridTemplateColumns: 'auto auto', gap: '8px 24px', textAlign: 'right', fontSize: '12px' }}>
              <div style={{ color: mutedTextColor, fontWeight: 400 }}>{data.documentLabels?.date || t('issue_date_label', 'Issue Date')}</div>
              <div style={{ fontWeight: 600 }}>{formatDate(data.details.issueDate)}</div>
              
              {data.details.dueDate && (
                <>
                  <div style={{ color: mutedTextColor, fontWeight: 400 }}>{data.documentLabels?.dueDate || t('due_date_label', 'Due Date')}</div>
                  <div style={{ fontWeight: 600 }}>{formatDate(data.details.dueDate)}</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div style={{ marginBottom: isCompact ? '20px' : '40px', borderTop: darkBorder, paddingTop: isCompact ? '16px' : '24px', display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: mutedTextColor, fontWeight: 600, marginBottom: '8px' }}>
              {data.documentLabels?.billTo || t('bill_to_label', 'Billed To')}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px', color: mainTextColor }}>
              {data.client.name || '\u00A0'}
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.5, color: mutedTextColor }}>
              {clientAddressLines.map((line, idx) => <div key={idx}>{line}</div>)}
              {data.client.email && <div>{data.client.email}</div>}
              {data.client.phone && <div>{data.client.phone}</div>}
              {data.client.taxId && <div style={{ marginTop: '4px' }}>{t('tax_id_label', 'Tax ID:')} {data.client.taxId}</div>}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: isCompact ? '20px' : '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: isCompact ? '11px' : '12px' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600, color: mainTextColor, borderBottom: darkBorder, borderTop: darkBorder, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px' }}>{t('description_header', 'Description')}</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 600, color: mainTextColor, borderBottom: darkBorder, borderTop: darkBorder, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px', width: '15%' }}>{t('price_header', 'Price')}</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600, color: mainTextColor, borderBottom: darkBorder, borderTop: darkBorder, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px', width: '10%' }}>{t('qty_header', 'Qty')}</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 600, color: mainTextColor, borderBottom: darkBorder, borderTop: darkBorder, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px', width: '20%' }}>{t('total_header', 'Total')}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td style={{ padding: isCompact ? '8px 4px' : '16px 8px', verticalAlign: 'top', borderBottom: lightBorder }}>
                    <div style={{ fontWeight: 600, fontSize: isCompact ? '11px' : '12px', color: mainTextColor }}>{item.name || '\u00A0'}</div>
                    {item.description && <div style={{ marginTop: '2px', color: mutedTextColor, whiteSpace: 'pre-wrap', lineHeight: 1.4, fontSize: isCompact ? '10px' : '11px' }}>{item.description}</div>}
                  </td>
                  <td style={{ padding: isCompact ? '8px 4px' : '16px 8px', verticalAlign: 'top', textAlign: 'right', borderBottom: lightBorder, color: mutedTextColor }}>
                    {formatCurrency(sanitizeNumber(item.rate), data.details.currency)}
                  </td>
                  <td style={{ padding: isCompact ? '8px 4px' : '16px 8px', verticalAlign: 'top', textAlign: 'center', borderBottom: lightBorder, color: mutedTextColor }}>
                    {sanitizeNumber(item.quantity)}
                  </td>
                  <td style={{ padding: isCompact ? '8px 4px' : '16px 8px', verticalAlign: 'top', textAlign: 'right', borderBottom: lightBorder, fontWeight: 600, color: mainTextColor }}>
                    {formatCurrency(calculateLineAmount(item.rate, item.quantity), data.details.currency)}
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '32px 8px', textAlign: 'center', color: mutedTextColor, fontStyle: 'italic', borderBottom: lightBorder }}>
                    No items added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: isCompact ? '24px' : '48px' }}>
          <div style={{ width: '320px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: mutedTextColor, fontSize: '12px' }}>
              <span>{t('subtotal_label', 'Subtotal')}</span>
              <span style={{ fontWeight: 500, color: mainTextColor }}>{formatCurrency(data.totals.subtotal, data.details.currency)}</span>
            </div>
            
            {data.totals.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: mutedTextColor, fontSize: '12px' }}>
                <span>{t('discount_label', 'Discount')}</span>
                <span style={{ color: mainTextColor }}>-{formatCurrency(data.totals.discountAmount, data.details.currency)}</span>
              </div>
            )}
            
            {Number(data.totals.taxRate) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: mutedTextColor, fontSize: '12px' }}>
                <span>{data.totals.taxLabel || t('tax_label', 'Tax')} ({sanitizeNumber(data.totals.taxRate)}%)</span>
                <span style={{ color: mainTextColor }}>{formatCurrency(data.totals.taxAmount, data.details.currency)}</span>
              </div>
            )}
            
            {Number(data.totals.shipping) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: mutedTextColor, fontSize: '12px' }}>
                <span>{t('shipping_label', 'Shipping')}</span>
                <span style={{ color: mainTextColor }}>{formatCurrency(sanitizeNumber(data.totals.shipping), data.details.currency)}</span>
              </div>
            )}
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '16px 0', 
              borderTop: darkBorder,
              borderBottom: darkBorder,
              marginTop: '8px',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 600, fontSize: '14px', color: mainTextColor, textTransform: 'uppercase', letterSpacing: '1px' }}>{t('total_label', 'Total Due')}</span>
              <span style={{ fontWeight: 700, fontSize: '18px', color: mainTextColor }}>{formatCurrency(data.totals.balanceDue, data.details.currency)}</span>
            </div>

            {Number(data.totals.amountPaid) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', color: mutedTextColor, fontSize: '12px' }}>
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
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: mutedTextColor, fontWeight: 600, marginBottom: '6px' }}>
                  {t('payment_instructions_label', 'Payment Instructions')}
                </div>
                <div style={{ fontSize: '11px', color: mainTextColor, whiteSpace: 'pre-wrap', lineHeight: 1.5, padding: '12px', border: lightBorder }}>
                  {data.paymentInstructions}
                </div>
              </div>
            )}
            
            {data.notes && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: mutedTextColor, fontWeight: 600, marginBottom: '6px' }}>
                  {t('notes_label', 'Notes')}
                </div>
                <div style={{ fontSize: '11px', color: mutedTextColor, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {data.notes}
                </div>
              </div>
            )}

            {data.terms && (
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: mutedTextColor, fontWeight: 600, marginBottom: '6px' }}>
                  {t('terms_label', 'Terms & Conditions')}
                </div>
                <div style={{ fontSize: '11px', color: mutedTextColor, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {data.terms}
                </div>
              </div>
            )}
          </div>

          <div style={{ width: '220px', textAlign: 'center' }}>
            {data.signatureUrl ? (
              <div style={{ marginTop: '24px' }}>
                <img src={data.signatureUrl} crossOrigin="anonymous" alt="Signature" style={{ maxHeight: '60px', maxWidth: '200px', objectFit: 'contain', marginBottom: '8px', filter: 'grayscale(100%)' }} />
                <div style={{ borderTop: darkBorder, paddingTop: '8px', fontSize: '11px', color: mutedTextColor, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t('authorized_signature', 'Authorized Signature')}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '60px', borderTop: darkBorder, paddingTop: '8px', fontSize: '11px', color: mutedTextColor, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
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
