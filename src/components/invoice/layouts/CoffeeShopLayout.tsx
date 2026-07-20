import React, { useMemo } from 'react';
import type { InvoiceData } from '../../../types/invoice';
import { formatCurrency } from '../../../utils/currency';
import { calculateLineAmount } from '../../../utils/calculations';
import { Mail, Phone, Coffee } from 'lucide-react';

interface CoffeeShopLayoutProps {
  data: InvoiceData;
  isCompact?: boolean;
}

export const CoffeeShopLayout: React.FC<CoffeeShopLayoutProps> = ({ data, isCompact = false }) => {
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
      background: '#FFFDF9', // Warm, creamy background
      fontFamily: '"Outfit", "Inter", sans-serif',
      color: '#43302B', // Dark coffee text
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Top Banner Accent */}
      <div style={{ height: '8px', background: 'linear-gradient(90deg, #D97706 0%, #B45309 100%)', width: '100%' }}></div>

      <div style={{ padding: isCompact ? '24px 40px' : '40px 60px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isCompact ? '24px' : '48px' }}>
          <div>
            <h1 style={{ fontSize: isCompact ? '32px' : '40px', fontWeight: 800, color: '#43302B', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Coffee size={isCompact ? 28 : 36} color="#D97706" />
              RECEIPT
            </h1>
            <div style={{ fontSize: '15px', color: '#785A52', marginTop: '4px', fontWeight: 500 }}>
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
              <h2 style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: '#43302B' }}>{data.business.name}</h2>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ 
          display: 'flex', 
          gap: '40px', 
          marginBottom: isCompact ? '32px' : '48px',
          borderBottom: '2px solid #F3EAE3',
          paddingBottom: '32px'
        }}>
          {/* Business Info */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#43302B', marginBottom: '8px' }}>{data.business.name}</div>
            <div style={{ fontSize: '14px', color: '#785A52', lineHeight: '1.6' }}>
              {businessAddressLines.map((line, i) => <div key={i}>{line}</div>)}
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                {data.business.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {data.business.email}</span>}
                {data.business.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {data.business.phone}</span>}
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div style={{ flex: 1 }}>
            {data.client.name && (
              <>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#A18780', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>Customer</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#43302B', marginBottom: '4px' }}>{data.client.name}</div>
                <div style={{ fontSize: '14px', color: '#785A52', lineHeight: '1.6' }}>
                  {data.client.email && <div>{data.client.email}</div>}
                  {clientAddressLines.length > 0 && <div>{clientAddressLines.join(', ')}</div>}
                </div>
              </>
            )}
          </div>

          {/* Invoice Details */}
          <div style={{ flex: '0 0 auto', textAlign: 'right' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#A18780', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Date</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#43302B' }}>{new Date(data.details.issueDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: isCompact ? '32px' : '48px', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px dashed #E5D5CD' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#A18780', textTransform: 'uppercase', width: '50%' }}>Order Item</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#A18780', textTransform: 'uppercase', width: '15%' }}>Qty</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#A18780', textTransform: 'uppercase', width: '15%' }}>Price</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#A18780', textTransform: 'uppercase', width: '20%' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F3EAE3' }}>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ fontWeight: 600, color: '#43302B', fontSize: '15px' }}>{item.name || 'Item'}</div>
                    {item.description && <div style={{ fontSize: '13px', color: '#785A52', marginTop: '4px', lineHeight: '1.5' }}>{item.description}</div>}
                  </td>
                  <td style={{ padding: '16px 8px', textAlign: 'center', fontSize: '15px', color: '#43302B' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '16px 8px', textAlign: 'right', fontSize: '15px', color: '#43302B' }}>
                    {formatCurrency(Number(item.rate), data.details.currency)}
                  </td>
                  <td style={{ padding: '16px 8px', textAlign: 'right', fontSize: '15px', fontWeight: 700, color: '#43302B' }}>
                    {formatCurrency(calculateLineAmount(item.rate, item.quantity), data.details.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', pageBreakInside: 'avoid' }}>
          
          {/* Totals Table */}
          <div style={{ width: '50%', background: '#FDF7F3', padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#785A52' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(data.totals.subtotal, data.details.currency)}</span>
              </div>
              
              {data.totals.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#785A52' }}>
                  <span>Discount</span>
                  <span style={{ color: '#D97706' }}>-{formatCurrency(data.totals.discountAmount, data.details.currency)}</span>
                </div>
              )}
              
              {data.totals.taxAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#785A52' }}>
                  <span>{data.totals.taxLabel || 'Tax'} ({data.totals.taxRate}%)</span>
                  <span>{formatCurrency(data.totals.taxAmount, data.details.currency)}</span>
                </div>
              )}
              
              {Number(data.totals.shipping) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#785A52' }}>
                  <span>Tip / Additional</span>
                  <span>{formatCurrency(Number(data.totals.shipping), data.details.currency)}</span>
                </div>
              )}

              <div style={{ height: '2px', background: '#E5D5CD', margin: '8px 0' }}></div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '20px', 
                fontWeight: 800, 
                color: '#43302B',
              }}>
                <span>Total</span>
                <span>{formatCurrency(data.totals.total, data.details.currency)}</span>
              </div>

              {Number(data.totals.amountPaid) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#10B981', fontWeight: 700, marginTop: '8px' }}>
                  <span>Amount Paid</span>
                  <span>-{formatCurrency(Number(data.totals.amountPaid), data.details.currency)}</span>
                </div>
              )}
              
              {Number(data.totals.amountPaid) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#43302B', marginTop: '8px' }}>
                  <span>Balance Due</span>
                  <span>{formatCurrency(data.totals.balanceDue, data.details.currency)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div style={{ marginTop: '48px', textAlign: 'center', color: '#A18780', fontSize: '14px', fontStyle: 'italic' }}>
            {data.notes ? data.notes : "Thank you for your business!"}
        </div>
      </div>
    </div>
  );
};
