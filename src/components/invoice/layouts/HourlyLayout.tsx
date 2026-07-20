import React, { useMemo } from 'react';
import type { InvoiceData } from '../../../types/invoice';
import { formatCurrency } from '../../../utils/currency';
import { calculateLineAmount } from '../../../utils/calculations';
import { Mail, Phone, Clock } from 'lucide-react';

interface HourlyLayoutProps {
  data: InvoiceData;
  isCompact?: boolean;
}

export const HourlyLayout: React.FC<HourlyLayoutProps> = ({ data, isCompact = false }) => {
  const formatAddress = (entity: { address?: string, address1?: string, address2?: string, city?: string, state?: string, postalCode?: string, country?: string }) => {
    if (entity.address) return entity.address.split('\n');
    const lines = [];
    if (entity.address1) lines.push(entity.address1);
    if (entity.address2) lines.push(entity.address2);
    const csz = [entity.city, entity.state, entity.postalCode].filter(Boolean).join(' ');
    if (csz) lines.push(csz);
    if (entity.country) lines.push(entity.country);
    return lines;
  };

  const businessAddressLines = useMemo(() => formatAddress(data.business), [data.business]);
  const clientAddressLines = useMemo(() => formatAddress(data.client), [data.client]);

  return (
    <div style={{
      width: '100%',
      minHeight: '100%',
      background: '#FFFFFF',
      fontFamily: '"Inter", sans-serif',
      color: '#1E293B',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Top Banner Accent */}
      <div style={{ height: '12px', background: 'var(--color-primary)', width: '100%' }}></div>

      <div style={{ padding: isCompact ? '24px 40px' : '40px 60px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isCompact ? '24px' : '48px' }}>
          <div>
            <h1 style={{ fontSize: isCompact ? '32px' : '40px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock size={isCompact ? 28 : 36} color="var(--color-primary)" />
              INVOICE
            </h1>
            <div style={{ fontSize: '15px', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>
              #{data.details.invoiceNumber}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            {data.business.logoUrl ? (
              <img 
                src={data.business.logoUrl} 
                alt="Business Logo" 
                style={{ maxHeight: isCompact ? '60px' : '80px', maxWidth: '200px', objectFit: 'contain' }} 
              />
            ) : (
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0F172A' }}>{data.business.name}</h2>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '40px', 
          marginBottom: isCompact ? '32px' : '48px',
          background: '#F8FAFC',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #E2E8F0'
        }}>
          {/* Business Info */}
          <div>
            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '12px' }}>From</h3>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>{data.business.name}</div>
            <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
              {businessAddressLines.map((line, i) => <div key={i}>{line}</div>)}
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                {data.business.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {data.business.email}</span>}
                {data.business.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {data.business.phone}</span>}
              </div>
            </div>
          </div>

          {/* Client & Invoice Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '12px' }}>Billed To</h3>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>{data.client.name}</div>
              <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                {clientAddressLines.map((line, i) => <div key={i}>{line}</div>)}
                {data.client.email && <div style={{ marginTop: '4px' }}>{data.client.email}</div>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Issue Date</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{new Date(data.details.issueDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Due Date</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{new Date(data.details.dueDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: isCompact ? '32px' : '48px', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', width: '45%' }}>Service Description</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', width: '15%' }}>Hours</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', width: '20%' }}>Rate/Hr</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', width: '20%' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>{item.name || 'Service'}</div>
                    {item.description && <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', lineHeight: '1.5' }}>{item.description}</div>}
                  </td>
                  <td style={{ padding: '16px 8px', textAlign: 'center', fontSize: '14px', color: '#334155' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '16px 8px', textAlign: 'right', fontSize: '14px', color: '#334155' }}>
                    {formatCurrency(Number(item.rate), data.details.currency)}
                  </td>
                  <td style={{ padding: '16px 8px', textAlign: 'right', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                    {formatCurrency(calculateLineAmount(item.rate, item.quantity), data.details.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pageBreakInside: 'avoid' }}>
          {/* Notes & Terms */}
          <div style={{ width: '50%', paddingRight: '40px' }}>
            {data.notes && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Notes</h4>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{data.notes}</div>
              </div>
            )}
            {data.terms && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Terms & Conditions</h4>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{data.terms}</div>
              </div>
            )}
            {data.paymentInstructions && (
               <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Payment Instructions</h4>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{data.paymentInstructions}</div>
              </div>
            )}
          </div>

          {/* Totals Table */}
          <div style={{ width: '40%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#475569' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(data.totals.subtotal, data.details.currency)}</span>
              </div>
              
              {data.totals.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#475569' }}>
                  <span>Discount</span>
                  <span style={{ color: '#EF4444' }}>-{formatCurrency(data.totals.discountAmount, data.details.currency)}</span>
                </div>
              )}
              
              {data.totals.taxAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#475569' }}>
                  <span>{data.totals.taxLabel || 'Tax'} ({data.totals.taxRate}%)</span>
                  <span>{formatCurrency(data.totals.taxAmount, data.details.currency)}</span>
                </div>
              )}
              
              {Number(data.totals.shipping) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#475569' }}>
                  <span>Shipping</span>
                  <span>{formatCurrency(Number(data.totals.shipping), data.details.currency)}</span>
                </div>
              )}

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '18px', 
                fontWeight: 700, 
                color: '#FFFFFF',
                background: 'var(--color-primary)',
                padding: '16px 20px',
                borderRadius: '8px',
                marginTop: '8px'
              }}>
                <span>Total Due</span>
                <span>{formatCurrency(data.totals.total, data.details.currency)}</span>
              </div>

              {Number(data.totals.amountPaid) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#10B981', fontWeight: 600, marginTop: '8px', padding: '0 8px' }}>
                  <span>Amount Paid</span>
                  <span>-{formatCurrency(Number(data.totals.amountPaid), data.details.currency)}</span>
                </div>
              )}
              
              {Number(data.totals.amountPaid) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, color: '#0F172A', marginTop: '8px', padding: '0 8px' }}>
                  <span>Balance Due</span>
                  <span>{formatCurrency(data.totals.balanceDue, data.details.currency)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {data.signatureUrl && (
          <div style={{ marginTop: '48px', width: '200px', pageBreakInside: 'avoid' }}>
            <img src={data.signatureUrl} alt="Signature" style={{ width: '100%', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }} />
            <div style={{ fontSize: '14px', color: '#64748B', paddingTop: '8px', textAlign: 'center' }}>Authorized Signature</div>
          </div>
        )}
      </div>
    </div>
  );
};
