import React from 'react';
import type { InvoiceData } from '../../types/invoice';
import { formatCurrency } from '../../utils/currency';
import { formatAddress } from '../../utils/addressFormatter';

interface PreviewSidebarProps {
  data: InvoiceData;
  onOpenFullPreview: () => void;
}

export const PreviewSidebar: React.FC<PreviewSidebarProps> = ({ data, onOpenFullPreview }) => {
  const businessAddressLines = formatAddress(data.business);
  const clientAddressLines = formatAddress(data.client);

  return (
    <div className="workspace-sidebar desktop-only" style={{ position: 'sticky', top: '84px', alignSelf: 'flex-start', width: '380px' }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Live Preview</span>
          <button 
            onClick={onOpenFullPreview}
            style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Expand
          </button>
        </div>
        
        {/* Miniature Cropped Invoice Paper (Clean white sheet aesthetics) */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: '6px',
          padding: '28px 24px',
          minHeight: '340px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-sm)',
          lineHeight: 1.4
        }}>
          {/* Header */}
          <div className="flex justify-between" style={{ marginBottom: '20px', alignItems: 'flex-start' }}>
            <div>
              {data.business.logoUrl && (
                <div style={{ width: '40px', height: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden' }}>
                  <img src={data.business.logoUrl} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              )}
              <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)', fontSize: '14px', marginBottom: '2px' }}>
                {data.business.name ? data.business.name : <span style={{ color: 'var(--color-text-tertiary)' }}>Business Name</span>}
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                {data.business.email ? data.business.email : <span style={{ color: 'var(--color-text-tertiary)' }}>Email</span>}
              </div>
              {data.business.phone && (
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>{data.business.phone}</div>
              )}
              {data.business.website && (
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>{data.business.website}</div>
              )}
              {businessAddressLines.map((line, idx) => (
                <div key={idx} style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>{line}</div>
              ))}
              {data.business.taxId && (
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>Tax ID: {data.business.taxId}</div>
              )}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              INVOICE
            </div>
          </div>
          
          {/* Bill to & Invoice details */}
          <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ flex: 1, paddingRight: '12px' }}>
              <div style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Bill To</div>
              <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)' }}>
                {data.client.name ? data.client.name : <span style={{ color: 'var(--color-text-tertiary)' }}>Client Name</span>}
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '11px', wordBreak: 'break-all' }}>
                {data.client.email ? data.client.email : <span style={{ color: 'var(--color-text-tertiary)' }}>Client Email</span>}
              </div>
              {data.client.phone && (
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '11px', wordBreak: 'break-word' }}>{data.client.phone}</div>
              )}
              {clientAddressLines.map((line, idx) => (
                <div key={idx} style={{ color: 'var(--color-text-secondary)', fontSize: '11px', wordBreak: 'break-word' }}>{line}</div>
              ))}
              {data.client.taxId && (
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '11px', wordBreak: 'break-word' }}>Tax ID: {data.client.taxId}</div>
              )}
            </div>
            <div className="text-right" style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>
              <div>Invoice No: <span style={{ color: 'var(--color-text-main)', fontWeight: 'bold' }}>{data.details.invoiceNumber}</span></div>
              <div>Date: {data.details.issueDate}</div>
              <div>Due: {data.details.dueDate}</div>
            </div>
          </div>

          {/* Simple Items List in Cropped Preview */}
          <div style={{ fontSize: '11px', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '10px 0', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.2fr', fontWeight: 'bold', color: 'var(--color-text-main)', marginBottom: '6px' }}>
              <span>Item</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Price</span>
            </div>
            {data.items.slice(0, 2).map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.2fr', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name || 'Untitled item'}</span>
                <span className="text-right">{item.quantity}</span>
                <span className="text-right">{formatCurrency(Number(item.rate) * Number(item.quantity), data.details.currency)}</span>
              </div>
            ))}
            {data.items.length > 2 && (
              <div style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic', marginTop: '4px', fontSize: '10px' }}>
                + {data.items.length - 2} more items...
              </div>
            )}
          </div>
          
          {/* Totals */}
          <div style={{ 
            fontSize: '12px', 
            paddingTop: '6px', 
            marginTop: 'auto'
          }}>
            <div className="flex justify-between font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              <span>Total</span>
              <span style={{ color: 'var(--color-text-main)', fontWeight: 'bold' }}>{formatCurrency(data.totals.total, data.details.currency)}</span>
            </div>
            <div className="flex justify-between font-bold" style={{ color: 'var(--color-primary)', marginTop: '4px', fontSize: '13px' }}>
              <span>Balance Due</span>
              <span>{formatCurrency(data.totals.balanceDue, data.details.currency)}</span>
            </div>
          </div>
        </div>

        {/* Client & Item Details Summary */}
        <div className="flex-col gap-2 text-xs" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
          <div className="flex justify-between">
            <span className="text-secondary">Client:</span>
            <span className="font-semibold text-main" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '200px' }}>
              {data.client.name ? data.client.name : <span style={{ color: 'var(--color-text-tertiary)' }}>Not added</span>}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Items:</span>
            <span className="font-semibold text-main">
              {data.items.length} {data.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Total:</span>
            <span className="font-semibold text-main">{formatCurrency(data.totals.total, data.details.currency)}</span>
          </div>
        </div>
        
        <button 
          className="btn btn-outline text-xs" 
          style={{ width: '100%' }}
          onClick={onOpenFullPreview}
        >
          Preview full invoice
        </button>
      </div>
    </div>
  );
};
