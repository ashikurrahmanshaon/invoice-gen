import React from 'react';
import { Download, Eye, ShieldCheck } from 'lucide-react';
import type { InvoiceData } from '../../types/invoice';

interface CompletionAreaProps {
  data: InvoiceData;
  onPreview: () => void;
  onDownload: () => void;
}

export const CompletionArea: React.FC<CompletionAreaProps> = ({ onPreview, onDownload }) => {
  return (
    <div className="flex-col items-center text-center" style={{ 
      margin: 'var(--space-12) 0 var(--space-8)',
      padding: 'var(--space-8) 0',
      borderTop: '1px solid var(--color-border)',
      gap: 'var(--space-4)'
    }}>
      <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-main)' }}>Ready to finish your invoice?</h3>
      <p className="text-secondary text-sm" style={{ marginBottom: 'var(--space-2)' }}>Review your details before downloading.</p>
      
      <div className="flex gap-4 justify-center" style={{ width: '100%', maxWidth: '400px' }}>
        <button className="btn btn-outline" style={{ flex: 1 }} onClick={onPreview}>
          <Eye size={16} /> Preview Invoice
        </button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={onDownload}>
          <Download size={16} /> Download PDF
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-tertiary" style={{ marginTop: 'var(--space-3)' }}>
        <ShieldCheck size={16} style={{ color: 'var(--color-success)' }} />
        <span>Your invoice draft is saved in this browser. No account required.</span>
      </div>
    </div>
  );
};
