import React from 'react';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer style={{ 
      background: '#0B1220', 
      color: '#98A2B3', 
      padding: 'var(--space-10) 0',
      fontSize: 'var(--text-sm)'
    }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap',
          gap: 'var(--space-6)'
        }}>
          {/* Left: Branding */}
          <div style={{ flex: '1 1 300px' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 'var(--space-3)' }}>
              <Logo size={24} color="#155EEF" />
              <span className="font-bold text-lg" style={{ color: 'white' }}>Invoice-Gen</span>
            </div>
            <p style={{ maxWidth: '260px', color: '#667085', lineHeight: 1.5 }}>
              Professional invoices. Free, fast, and simple.
            </p>
          </div>
          
          {/* Navigation Columns */}
          <div style={{ display: 'flex', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
            <div className="flex-col gap-2">
              <span style={{ color: 'white', fontWeight: 600, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '1px' }}>Links</span>
              <a href="#root" style={{ color: '#98A2B3' }} className="hover:text-white">Invoice Generator</a>
              <a href="#how-it-works" style={{ color: '#98A2B3' }} className="hover:text-white">How It Works</a>
              <a href="#faq" style={{ color: '#98A2B3' }} className="hover:text-white">FAQ</a>
            </div>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid #1E293B', 
          paddingTop: 'var(--space-6)', 
          display: 'flex', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          color: '#667085',
          fontSize: 'var(--text-xs)'
        }}>
          <span>&copy; {new Date().getFullYear()} Invoice-Gen. All rights reserved.</span>
          <span>Made for freelancers and businesses.</span>
        </div>
      </div>
    </footer>
  );
};
