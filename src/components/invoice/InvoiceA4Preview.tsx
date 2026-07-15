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

// Memoized sections to ensure 16ms render performance

const PreviewHeader = React.memo(({ business, themeColor }: { business: InvoiceData['business'], themeColor: string }) => {
  const { t } = useTranslation();
  const businessAddressLines = useMemo(() => formatAddress(business), [business]);
  
  return (
    <>
      {/* Accent Header Band */}
      <div style={{ 
        background: themeColor, 
        margin: '-80px -80px 40px -80px', 
        padding: '40px 80px 32px 80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {business.logoUrl && (
            <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }}>
              <img src={business.logoUrl} alt="Logo" loading="lazy" width="48" height="48" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          )}
          <div style={{ color: '#FFFFFF', fontWeight: 500, fontSize: '18px' }}>
            {business.name || '\u00A0'}
          </div>
        </div>
        <div style={{ fontSize: '24px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', letterSpacing: '3px' }}>
          {t('invoice_title', 'INVOICE')}
        </div>
      </div>

      {/* Business Contact Details */}
      <div style={{ color: '#64748B', fontSize: '12px', lineHeight: 1.6, marginBottom: '32px' }}>
        {business.email && <div>{business.email}</div>}
        {business.phone && <div>{business.phone}</div>}
        {business.website && <div>{business.website}</div>}
        {businessAddressLines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
        {business.taxId && <div>{t('tax_id_label', 'Tax ID:')} {business.taxId}</div>}
      </div>
    </>
  );
});

const PreviewMeta = React.memo(({ details }: { details: InvoiceData['details'] }) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
      <table style={{ width: 'auto', borderCollapse: 'collapse', fontSize: '12px' }}>
        <tbody>
          <tr>
            <td style={{ padding: '4px 16px 4px 0', fontWeight: 600, color: '#667085', textAlign: 'right' }}>{t('invoice_no_label', 'Invoice No:')}</td>
            <td style={{ padding: '4px 0', color: '#1B263B', textAlign: 'right' }}>{details.invoiceNumber}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 16px 4px 0', fontWeight: 600, color: '#667085', textAlign: 'right' }}>{t('date_label', 'Date:')}</td>
            <td style={{ padding: '4px 0', color: '#1B263B', textAlign: 'right' }}>{formatDate(details.issueDate)}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 16px 4px 0', fontWeight: 600, color: '#667085', textAlign: 'right' }}>{t('due_date_label', 'Due Date:')}</td>
            <td style={{ padding: '4px 0', color: '#1B263B', textAlign: 'right' }}>{formatDate(details.dueDate)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

const PreviewClient = React.memo(({ client, themeColor }: { client: InvoiceData['client'], themeColor: string }) => {
  const { t } = useTranslation();
  const clientAddressLines = useMemo(() => formatAddress(client), [client]);
  
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ color: themeColor, fontWeight: 700, fontSize: '12px', letterSpacing: '1px', marginBottom: '8px' }}>
        {t('bill_to_label', 'BILL TO')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '50%' }}>
        <div style={{ fontWeight: 700, color: themeColor, fontSize: '14px', marginBottom: '4px' }}>
          {client.name || '\u00A0'}
        </div>
        <div style={{ color: '#667085', fontSize: '12px', lineHeight: 1.5 }}>
          {client.email && <div>{client.email}</div>}
          {client.phone && <div>{client.phone}</div>}
          {clientAddressLines.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
          {client.taxId && <div>{t('tax_id_label', 'Tax ID:')} {client.taxId}</div>}
        </div>
      </div>
    </div>
  );
});

const PreviewItems = React.memo(({ items, currency }: { items: InvoiceData['items'], currency: string }) => {
  const { t } = useTranslation();
  return (
    <div style={{ marginBottom: '40px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E4E7EC', borderBottom: '1px solid #E4E7EC' }}>
            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#1B263B', fontWeight: 700 }}>{t('item_header', 'Item / Service')}</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#1B263B', fontWeight: 700 }}>{t('description_header', 'Description')}</th>
            <th style={{ padding: '12px 16px', textAlign: 'right', color: '#1B263B', fontWeight: 700 }}>{t('rate_header', 'Rate')}</th>
            <th style={{ padding: '12px 16px', textAlign: 'center', color: '#1B263B', fontWeight: 700 }}>{t('qty_header', 'Qty')}</th>
            <th style={{ padding: '12px 16px', textAlign: 'right', color: '#1B263B', fontWeight: 700 }}>{t('amount_header', 'Amount')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id || idx} style={{ borderBottom: '1px solid #E4E7EC' }}>
              <td style={{ padding: '16px', color: '#1B263B', verticalAlign: 'top', width: '25%' }}>{item.name || '\u00A0'}</td>
              <td style={{ padding: '16px', color: '#667085', verticalAlign: 'top', whiteSpace: 'pre-wrap' }}>{item.description}</td>
              <td style={{ padding: '16px', color: '#1B263B', verticalAlign: 'top', textAlign: 'right', width: '15%' }}>{formatCurrency(sanitizeNumber(item.rate), currency)}</td>
              <td style={{ padding: '16px', color: '#1B263B', verticalAlign: 'top', textAlign: 'center', width: '10%' }}>{sanitizeNumber(item.quantity)}</td>
              <td style={{ padding: '16px', color: '#1B263B', verticalAlign: 'top', textAlign: 'right', width: '15%' }}>{formatCurrency(calculateLineAmount(item.rate, item.quantity), currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

const PreviewTotals = React.memo(({ totals, currency, themeColor }: { totals: InvoiceData['totals'], currency: string, themeColor: string }) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
      <table style={{ width: '300px', borderCollapse: 'collapse', fontSize: '12px' }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px 16px 8px 0', color: '#1B263B' }}>{t('subtotal_label', 'Subtotal')}</td>
            <td style={{ padding: '8px 0', color: '#1B263B', textAlign: 'right' }}>{formatCurrency(totals.subtotal, currency)}</td>
          </tr>
          
          {Number(totals.discountValue) > 0 && (
            <tr>
              <td style={{ padding: '8px 16px 8px 0', color: '#1B263B' }}>
                {totals.discountType === 'percent' ? `${t('discount_label', 'Discount')} (${totals.discountValue}%)` : t('discount_label', 'Discount')}
              </td>
              <td style={{ padding: '8px 0', color: '#1B263B', textAlign: 'right' }}>-{formatCurrency(totals.discountAmount, currency)}</td>
            </tr>
          )}

          {(totals.taxAmount !== 0 || Number(totals.taxRate) !== 0) && (
            <tr>
              <td style={{ padding: '8px 16px 8px 0', color: '#1B263B' }}>{totals.taxLabel || 'Tax'} ({totals.taxRate}%)</td>
              <td style={{ padding: '8px 0', color: '#1B263B', textAlign: 'right' }}>{formatCurrency(totals.taxAmount, currency)}</td>
            </tr>
          )}

          {Number(totals.shipping) !== 0 && totals.shipping !== '' && (
            <tr>
              <td style={{ padding: '8px 16px 8px 0', color: '#1B263B' }}>{t('shipping_label', 'Shipping')}</td>
              <td style={{ padding: '8px 0', color: '#1B263B', textAlign: 'right' }}>{formatCurrency(Number(totals.shipping) || 0, currency)}</td>
            </tr>
          )}

          <tr>
            <td colSpan={2} style={{ padding: '4px 0' }}>
              <div style={{ height: '1px', backgroundColor: '#E4E7EC', width: '100%' }} />
            </td>
          </tr>

          <tr>
            <td style={{ padding: '12px 16px 12px 0', color: '#1B263B', fontWeight: 700 }}>{t('total_label', 'Total')}</td>
            <td style={{ padding: '12px 0', color: '#1B263B', textAlign: 'right', fontWeight: 700 }}>{formatCurrency(totals.total, currency)}</td>
          </tr>

          <tr>
            <td style={{ padding: '8px 16px 8px 0', color: '#1B263B' }}>{t('amount_paid_label', 'Amount Paid')}</td>
            <td style={{ padding: '8px 0', color: '#1B263B', textAlign: 'right' }}>{formatCurrency(Number(totals.amountPaid) || 0, currency)}</td>
          </tr>

          <tr>
            <td colSpan={2} style={{ padding: '8px 0' }}>
              <div style={{ 
                backgroundColor: themeColor, 
                padding: '12px 16px',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{t('balance_due_label', 'Balance Due')}</span>
                <span style={{ color: '#FFFFFF', fontWeight: 500, fontSize: '16px' }}>{formatCurrency(totals.balanceDue, currency)}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

const PreviewNotes = React.memo(({ notes, terms, paymentInstructions }: { notes: string, terms: string, paymentInstructions: string }) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '75%' }}>
      {notes && (
        <div>
          <div style={{ color: '#1B263B', fontWeight: 700, fontSize: '12px', marginBottom: '8px' }}>{t('notes_section', 'Notes')}</div>
          <div style={{ color: '#667085', fontSize: '11px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{notes}</div>
        </div>
      )}
      {terms && (
        <div>
          <div style={{ color: '#1B263B', fontWeight: 700, fontSize: '12px', marginBottom: '8px' }}>{t('terms_section', 'Terms & Conditions')}</div>
          <div style={{ color: '#667085', fontSize: '11px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{terms}</div>
        </div>
      )}
      {paymentInstructions && (
        <div>
          <div style={{ color: '#1B263B', fontWeight: 700, fontSize: '12px', marginBottom: '8px' }}>{t('payment_instructions_section', 'Payment Instructions')}</div>
          <div style={{ color: '#667085', fontSize: '11px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{paymentInstructions}</div>
        </div>
      )}
    </div>
  );
});

export const InvoiceA4Preview: React.FC<InvoiceA4PreviewProps> = ({ data, scale = 1 }) => {
  // A standard A4 document is 210mm x 297mm.
  // We use a base width of 800px for web rendering, which gives a height of 1131px.
  const BASE_WIDTH = 800;
  const A4_ASPECT_RATIO = 1.414;
  
  return (
    <div 
      style={{
        width: `${BASE_WIDTH * scale}px`,
        height: `${(BASE_WIDTH * A4_ASPECT_RATIO) * scale}px`,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <div 
        style={{
          width: `${BASE_WIDTH}px`,
          minHeight: `${BASE_WIDTH * A4_ASPECT_RATIO}px`,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
          padding: '80px', // Matches ~20mm margin
          fontFamily: 'Inter, sans-serif',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          boxSizing: 'border-box',
          // Set direction dynamically based on i18n
          direction: i18next.dir(),
        }}
      >
        <PreviewHeader business={data.business} themeColor={data.details.themeColor || '#155EEF'} />
        <PreviewMeta details={data.details} />
        <PreviewClient client={data.client} themeColor={data.details.themeColor || '#155EEF'} />
        <PreviewItems items={data.items} currency={data.details.currency} />
        <PreviewTotals totals={data.totals} currency={data.details.currency} themeColor={data.details.themeColor || '#155EEF'} />
        <PreviewNotes notes={data.notes} terms={data.terms} paymentInstructions={data.paymentInstructions} />
      </div>
    </div>
  );
};
