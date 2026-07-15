import React, { useMemo } from 'react';
import type { InvoiceData } from '../../types/invoice';
import { formatCurrency, formatDate } from '../../utils/currency';
import { formatAddress } from '../../utils/addressFormatter';
import { calculateLineAmount, sanitizeNumber } from '../../utils/calculations';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

interface InvoiceA4PreviewProps {
  data: InvoiceData;
  scale?: number;
}

const PreviewHeader = React.memo(({ details, business, themeColor }: { details: InvoiceData['details'], business: InvoiceData['business'], themeColor: string }) => {
  const { t } = useTranslation();
  
  return (
    <div style={{ marginBottom: '48px', position: 'relative' }}>
      {/* Subtle top accent bar */}
      <div style={{ position: 'absolute', top: '-64px', left: '-64px', right: '-64px', height: '8px', backgroundColor: themeColor }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {business.logoUrl && (
            <img src={business.logoUrl} alt="Logo" style={{ maxHeight: '64px', maxWidth: '160px', objectFit: 'contain' }} />
          )}
          <div style={{ 
            fontSize: business.logoUrl ? '20px' : '32px', 
            fontWeight: 800, 
            letterSpacing: '-0.5px', 
            color: '#0F172A'
          }}>
            {business.name || 'YOUR COMPANY'}
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            fontSize: '48px', 
            fontWeight: 800, 
            letterSpacing: '-1px', 
            textTransform: 'uppercase', 
            lineHeight: 1,
            color: '#CBD5E1',
            marginBottom: '16px'
          }}>
            {t('invoice_title', 'INVOICE')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: '#64748B' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <span style={{ fontWeight: 500 }}>{t('invoice_no_label', 'Invoice No')}</span>
              <span style={{ fontWeight: 700, color: '#0F172A', minWidth: '100px' }}>{details.invoiceNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <span style={{ fontWeight: 500 }}>{t('issue_date_label', 'Issue Date')}</span>
              <span style={{ fontWeight: 700, color: '#0F172A', minWidth: '100px' }}>{formatDate(details.issueDate)}</span>
            </div>
            {details.dueDate && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                <span style={{ fontWeight: 500 }}>{t('due_date_label', 'Due Date')}</span>
                <span style={{ fontWeight: 700, color: '#0F172A', minWidth: '100px' }}>{formatDate(details.dueDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

const PreviewAddresses = React.memo(({ business, client }: { business: InvoiceData['business'], client: InvoiceData['client'] }) => {
  const { t } = useTranslation();
  const businessAddressLines = useMemo(() => formatAddress(business), [business]);
  const clientAddressLines = useMemo(() => formatAddress(client), [client]);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      fontSize: '13px', 
      lineHeight: 1.6,
      marginBottom: '48px',
      gap: '48px'
    }}>
      {/* BILL TO */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '1px', marginBottom: '12px' }}>
          {t('bill_to_label', 'Billed To')}
        </div>
        <div style={{ color: '#0F172A' }}>
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{client.name || '\u00A0'}</div>
          {clientAddressLines.map((line, idx) => <div key={idx} style={{ color: '#475569' }}>{line}</div>)}
          {client.email && <div style={{ color: '#475569', marginTop: '4px' }}>{client.email}</div>}
          {client.phone && <div style={{ color: '#475569' }}>{client.phone}</div>}
          {client.taxId && <div style={{ color: '#475569', marginTop: '4px' }}>{t('tax_id_label', 'Tax ID:')} {client.taxId}</div>}
        </div>
      </div>

      {/* BILL FROM */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '1px', marginBottom: '12px' }}>
          {t('bill_from_label', 'From')}
        </div>
        <div style={{ color: '#0F172A' }}>
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{business.name || '\u00A0'}</div>
          {businessAddressLines.map((line, idx) => <div key={idx} style={{ color: '#475569' }}>{line}</div>)}
          {business.email && <div style={{ color: '#475569', marginTop: '4px' }}>{business.email}</div>}
          {business.phone && <div style={{ color: '#475569' }}>{business.phone}</div>}
          {business.taxId && <div style={{ color: '#475569', marginTop: '4px' }}>{t('tax_id_label', 'Tax ID:')} {business.taxId}</div>}
        </div>
      </div>
    </div>
  );
});

const PreviewItems = React.memo(({ items, currency }: { items: InvoiceData['items'], currency: string }) => {
  const { t } = useTranslation();
  return (
    <div style={{ marginBottom: '48px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
            <th style={{ padding: '12px 0', textAlign: 'left', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>{t('description_header', 'Description')}</th>
            <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', width: '15%' }}>{t('price_header', 'Price')}</th>
            <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', width: '10%' }}>{t('qty_header', 'Qty')}</th>
            <th style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', width: '20%' }}>{t('total_header', 'Total')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id || idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '16px 0', verticalAlign: 'top' }}>
                <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>{item.name || '\u00A0'}</div>
                {item.description && <div style={{ marginTop: '4px', color: '#64748B', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{item.description}</div>}
              </td>
              <td style={{ padding: '16px', verticalAlign: 'top', textAlign: 'right', color: '#475569' }}>{formatCurrency(sanitizeNumber(item.rate), currency)}</td>
              <td style={{ padding: '16px', verticalAlign: 'top', textAlign: 'center', color: '#475569' }}>{sanitizeNumber(item.quantity)}</td>
              <td style={{ padding: '16px 0', verticalAlign: 'top', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>{formatCurrency(calculateLineAmount(item.rate, item.quantity), currency)}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: '32px 0', textAlign: 'center', color: '#94A3B8', fontStyle: 'italic' }}>No items added</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

const PreviewTotalsTerms = React.memo(({ totals, currency, notes, terms, paymentInstructions, themeColor }: { totals: InvoiceData['totals'], currency: string, notes: string, terms: string, paymentInstructions: string, themeColor: string }) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '13px' }}>
      
      {/* Left Column: Notes, Terms, Payment */}
      <div style={{ width: '50%', paddingRight: '48px', color: '#475569', lineHeight: 1.6 }}>
        {paymentInstructions && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '1px', marginBottom: '8px' }}>
              {t('payment_label', 'Payment Instructions')}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{paymentInstructions}</div>
          </div>
        )}

        {(notes || terms) && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '1px', marginBottom: '8px' }}>
              {t('terms_conditions_label', 'Notes & Terms')}
            </div>
            {notes && <div style={{ whiteSpace: 'pre-wrap', marginBottom: terms ? '12px' : 0 }}>{notes}</div>}
            {terms && <div style={{ whiteSpace: 'pre-wrap' }}>{terms}</div>}
          </div>
        )}
      </div>

      {/* Right Column: Totals */}
      <div style={{ width: '40%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px', borderBottom: '2px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
            <span>{t('subtotal_label', 'Subtotal')}</span>
            <span style={{ fontWeight: 500, color: '#0F172A' }}>{formatCurrency(totals.subtotal, currency)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>{t('discount_label', 'Discount')}</span>
              <span style={{ fontWeight: 500, color: '#10B981' }}>-{formatCurrency(totals.discountAmount, currency)}</span>
            </div>
          )}
          {Number(totals.taxRate) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>{totals.taxLabel ? totals.taxLabel : t('tax_label', 'Tax')}</span>
              <span style={{ fontWeight: 500, color: '#0F172A' }}>{formatCurrency(totals.taxAmount, currency)}</span>
            </div>
          )}
          {Number(totals.shipping) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>{t('shipping_label', 'Shipping')}</span>
              <span style={{ fontWeight: 500, color: '#0F172A' }}>{formatCurrency(Number(totals.shipping), currency)}</span>
            </div>
          )}
          {Number(totals.amountPaid) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>{t('paid_label', 'Amount Paid')}</span>
              <span style={{ fontWeight: 500, color: '#0F172A' }}>-{formatCurrency(Number(totals.amountPaid), currency)}</span>
            </div>
          )}
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '16px',
          padding: '16px 20px',
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          border: '1px solid #E2E8F0'
        }}>
          <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px' }}>{t('total_label', 'Balance Due')}</span>
          <span style={{ fontWeight: 800, color: themeColor || '#0F172A', fontSize: '20px', letterSpacing: '-0.5px' }}>{formatCurrency(totals.balanceDue, currency)}</span>
        </div>
      </div>
    </div>
  );
});

export const InvoiceA4Preview: React.FC<InvoiceA4PreviewProps> = ({ data, scale = 1 }) => {
  const BASE_WIDTH = 800;
  const A4_ASPECT_RATIO = 1.414;
  
  return (
    <div 
      style={{
        width: `${BASE_WIDTH * scale}px`,
        position: 'relative',
        flexShrink: 0,
        height: `${BASE_WIDTH * A4_ASPECT_RATIO * scale}px`,
      }}
    >
      <div 
        style={{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_WIDTH * A4_ASPECT_RATIO}px`,
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
          padding: '64px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          boxSizing: 'border-box',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#0F172A',
          direction: i18next.dir(),
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          `}
        </style>

        <PreviewHeader details={data.details} business={data.business} themeColor={data.details.themeColor || '#0F172A'} />
        <PreviewAddresses business={data.business} client={data.client} />
        <PreviewItems items={data.items} currency={data.details.currency} />
        <PreviewTotalsTerms 
          totals={data.totals} 
          currency={data.details.currency} 
          notes={data.notes} 
          terms={data.terms} 
          paymentInstructions={data.paymentInstructions}
          themeColor={data.details.themeColor || '#0F172A'}
        />
        
        {/* Footer line */}
        {data.business.website && (
          <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '12px', color: '#94A3B8', fontWeight: 500, letterSpacing: '0.5px' }}>
            {data.business.website.replace(/^https?:\/\//, '')}
          </div>
        )}
      </div>
    </div>
  );
};
