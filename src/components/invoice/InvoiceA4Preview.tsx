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

const Divider = () => (
  <div style={{ width: '100%', height: '1px', backgroundColor: '#000', margin: '24px 0' }} />
);

const PreviewHeader = React.memo(({ details }: { details: InvoiceData['details'] }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ 
          fontSize: '46px', 
          fontWeight: 700, 
          letterSpacing: '2px', 
          textTransform: 'uppercase', 
          lineHeight: 1,
          fontFamily: '"Playfair Display", "Georgia", serif'
        }}>
          {t('invoice_title', 'INVOICE')}
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px', lineHeight: 1.6 }}>
          <div>#{details.invoiceNumber}</div>
          <div>{formatDate(details.issueDate)}</div>
          {details.dueDate && <div>Due: {formatDate(details.dueDate)}</div>}
        </div>
      </div>
      <Divider />
    </div>
  );
});

const PreviewInfo = React.memo(({ business, client, paymentInstructions }: { business: InvoiceData['business'], client: InvoiceData['client'], paymentInstructions: string }) => {
  const { t } = useTranslation();
  const businessAddressLines = useMemo(() => formatAddress(business), [business]);
  const clientAddressLines = useMemo(() => formatAddress(client), [client]);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', fontSize: '11px', lineHeight: 1.6 }}>
      {/* BILL TO */}
      <div style={{ flex: 1, paddingRight: '20px' }}>
        <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontFamily: '"Playfair Display", "Georgia", serif' }}>
          {t('bill_to_label', 'BILL TO')}
        </div>
        <div style={{ fontWeight: 600 }}>{client.name || '\u00A0'}</div>
        {clientAddressLines.map((line, idx) => <div key={idx}>{line}</div>)}
        {client.email && <div>{client.email}</div>}
        {client.phone && <div>{client.phone}</div>}
        {client.taxId && <div>{t('tax_id_label', 'Tax ID:')} {client.taxId}</div>}
      </div>

      {/* BILL FROM */}
      <div style={{ flex: 1, paddingRight: '20px' }}>
        <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontFamily: '"Playfair Display", "Georgia", serif' }}>
          {t('bill_from_label', 'BILL FROM')}
        </div>
        <div style={{ fontWeight: 600 }}>{business.name || '\u00A0'}</div>
        {businessAddressLines.map((line, idx) => <div key={idx}>{line}</div>)}
        {business.email && <div>{business.email}</div>}
        {business.phone && <div>{business.phone}</div>}
        {business.taxId && <div>{t('tax_id_label', 'Tax ID:')} {business.taxId}</div>}
      </div>

      {/* PAYMENT */}
      <div style={{ flex: 1, textAlign: 'right' }}>
        <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontFamily: '"Playfair Display", "Georgia", serif' }}>
          {t('payment_label', 'PAYMENT')}
        </div>
        {paymentInstructions ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{paymentInstructions}</div>
        ) : (
          <div style={{ color: '#666', fontStyle: 'italic' }}>No payment details provided</div>
        )}
      </div>
    </div>
  );
});

const PreviewItems = React.memo(({ items, currency }: { items: InvoiceData['items'], currency: string }) => {
  const { t } = useTranslation();
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ width: '100%', height: '1px', backgroundColor: '#000', marginBottom: '16px' }} />
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
        <thead>
          <tr>
            <th style={{ paddingBottom: '16px', textAlign: 'left', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Playfair Display", "Georgia", serif' }}>{t('description_header', 'DESCRIPTION')}</th>
            <th style={{ paddingBottom: '16px', textAlign: 'right', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Playfair Display", "Georgia", serif' }}>{t('price_header', 'PRICE')}</th>
            <th style={{ paddingBottom: '16px', textAlign: 'center', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Playfair Display", "Georgia", serif' }}>{t('qty_header', 'QTY')}</th>
            <th style={{ paddingBottom: '16px', textAlign: 'right', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Playfair Display", "Georgia", serif' }}>{t('total_header', 'TOTAL')}</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={4} style={{ padding: 0 }}><div style={{ width: '100%', height: '1px', backgroundColor: '#000', marginBottom: '16px' }} /></td></tr>
          {items.map((item, idx) => (
            <tr key={item.id || idx}>
              <td style={{ padding: '8px 0', verticalAlign: 'top', width: '40%' }}>
                <div style={{ fontWeight: 600 }}>{item.name || '\u00A0'}</div>
                {item.description && <div style={{ color: '#555', marginTop: '4px', whiteSpace: 'pre-wrap' }}>{item.description}</div>}
              </td>
              <td style={{ padding: '8px 0', verticalAlign: 'top', textAlign: 'right', width: '20%' }}>{formatCurrency(sanitizeNumber(item.rate), currency)}</td>
              <td style={{ padding: '8px 0', verticalAlign: 'top', textAlign: 'center', width: '20%' }}>{sanitizeNumber(item.quantity)}</td>
              <td style={{ padding: '8px 0', verticalAlign: 'top', textAlign: 'right', width: '20%', fontWeight: 600 }}>{formatCurrency(calculateLineAmount(item.rate, item.quantity), currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ width: '100%', height: '1px', backgroundColor: '#000', marginTop: '16px' }} />
    </div>
  );
});

const PreviewTotalsTerms = React.memo(({ totals, details, currency, notes, terms }: { totals: InvoiceData['totals'], details: InvoiceData['details'], currency: string, notes: string, terms: string }) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '11px' }}>
      {/* Terms & Conditions */}
      <div style={{ width: '50%', paddingRight: '40px' }}>
        {(notes || terms) && (
          <div style={{ fontWeight: 700, marginBottom: '8px', letterSpacing: '0.5px', fontFamily: '"Playfair Display", "Georgia", serif' }}>
            {t('terms_conditions_label', 'Terms & conditions')}
          </div>
        )}
        {notes && <div style={{ color: '#555', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: terms ? '12px' : 0 }}>{notes}</div>}
        {terms && <div style={{ color: '#555', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{terms}</div>}
      </div>

      {/* Totals */}
      <div style={{ width: '40%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '6px 0', fontWeight: 700, letterSpacing: '1px', fontFamily: '"Playfair Display", "Georgia", serif' }}>{t('subtotal_label', 'SUBTOTAL')}</td>
              <td style={{ padding: '6px 0', textAlign: 'right' }}>{formatCurrency(totals.subtotal, currency)}</td>
            </tr>
            {details.discount > 0 && (
              <tr>
                <td style={{ padding: '6px 0', fontWeight: 700, letterSpacing: '1px', fontFamily: '"Playfair Display", "Georgia", serif' }}>{t('discount_label', 'DISCOUNT')}</td>
                <td style={{ padding: '6px 0', textAlign: 'right' }}>-{formatCurrency(totals.discountAmount, currency)}</td>
              </tr>
            )}
            {details.taxRate > 0 && (
              <tr>
                <td style={{ padding: '6px 0', fontWeight: 700, letterSpacing: '1px', fontFamily: '"Playfair Display", "Georgia", serif' }}>{details.taxLabel ? details.taxLabel.toUpperCase() : t('tax_label', 'TAX')}</td>
                <td style={{ padding: '6px 0', textAlign: 'right' }}>{formatCurrency(totals.taxAmount, currency)}</td>
              </tr>
            )}
            {details.shipping > 0 && (
              <tr>
                <td style={{ padding: '6px 0', fontWeight: 700, letterSpacing: '1px', fontFamily: '"Playfair Display", "Georgia", serif' }}>{t('shipping_label', 'SHIPPING')}</td>
                <td style={{ padding: '6px 0', textAlign: 'right' }}>{formatCurrency(details.shipping, currency)}</td>
              </tr>
            )}
            {details.amountPaid > 0 && (
              <tr>
                <td style={{ padding: '6px 0', fontWeight: 700, letterSpacing: '1px', fontFamily: '"Playfair Display", "Georgia", serif' }}>{t('paid_label', 'PAID')}</td>
                <td style={{ padding: '6px 0', textAlign: 'right' }}>-{formatCurrency(details.amountPaid, currency)}</td>
              </tr>
            )}
            <tr>
              <td style={{ padding: '16px 0 6px 0', fontWeight: 700, letterSpacing: '1px', fontSize: '12px', fontFamily: '"Playfair Display", "Georgia", serif' }}>{t('total_label', 'TOTAL')}</td>
              <td style={{ padding: '16px 0 6px 0', textAlign: 'right', fontWeight: 700, fontSize: '12px' }}>{formatCurrency(totals.balanceDue, currency)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});

const PreviewFooter = React.memo(({ business }: { business: InvoiceData['business'] }) => {
  return (
    <div style={{ 
      marginTop: 'auto', // Pushes footer to the bottom if container is taller than content
      paddingTop: '64px',
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-end'
    }}>
      {/* Boxed Brand Name */}
      <div style={{ 
        border: '1px solid #000', 
        padding: '12px 24px', 
        fontWeight: 700, 
        letterSpacing: '2px', 
        textTransform: 'uppercase',
        fontSize: '11px',
        fontFamily: '"Playfair Display", "Georgia", serif'
      }}>
        {business.name || 'YOUR COMPANY'}
      </div>

      {/* Website with bottom border */}
      {business.website && (
        <div style={{ 
          borderBottom: '1px solid #000', 
          paddingBottom: '4px',
          fontSize: '12px',
          color: '#333'
        }}>
          {business.website.replace(/^https?:\/\//, '')}
        </div>
      )}
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
          height: `${BASE_WIDTH * A4_ASPECT_RATIO}px`, // Strict A4 height
          overflow: 'hidden', // Ensure it doesn't grow beyond A4 size
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
          padding: '64px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          boxSizing: 'border-box',
          fontFamily: '"Lora", "Georgia", serif', // Base font for the elegant look
          color: '#000', // Strict black and white
          direction: i18next.dir(),
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Load Google Fonts for the invoice */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
          `}
        </style>

        <PreviewHeader details={data.details} />
        <PreviewInfo business={data.business} client={data.client} paymentInstructions={data.paymentInstructions} />
        <PreviewItems items={data.items} currency={data.details.currency} />
        <PreviewTotalsTerms totals={data.totals} details={data.details} currency={data.details.currency} notes={data.notes} terms={data.terms} />
        <PreviewFooter business={data.business} />
      </div>
    </div>
  );
};
