import React, { useState, useEffect } from 'react';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return true;
  });

  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer id="main-footer" style={{ 
      background: 'var(--color-background)',
      color: 'var(--color-text-secondary)', 
      padding: '64px 0 32px 0',
      fontSize: '14px',
      borderTop: '1px solid var(--color-border)',
      fontFamily: "var(--font-family)",
      marginTop: '64px'
    }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* Main Footer Content */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isDesktop ? '1.5fr repeat(3, 1fr)' : '1fr', 
          gap: isDesktop ? '32px' : '32px',
        }}>
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Logo size={24} hideText={true} />
              <span style={{ 
                fontSize: '16px', 
                fontWeight: 700, 
                letterSpacing: '-0.02em', 
                color: 'var(--color-text-main)', 
                lineHeight: 1
              }}>
                Invoice-Gen.net
              </span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.5, margin: 0, maxWidth: '280px' }}>
              100% browser-native utility. Watermark-free, professional invoices generated instantly.
            </p>
          </div>

          {/* Column 1: Product */}
          <details open={isDesktop} className="footer-col">
            <summary className="footer-summary">Product</summary>
            <div className="footer-links">
              <a href="/">Invoice Generator</a>
              <a href="/templates/">Templates</a>
              <a href="/trust/">Trust Center</a>
            </div>
          </details>

          {/* Column 2: Resources */}
          <details open={isDesktop} className="footer-col">
            <summary className="footer-summary">Resources</summary>
            <div className="footer-links">
              <a href="/blog/how-to-create-professional-invoice/">Create Invoice Guide</a>
              <a href="/blog/what-to-include-in-invoice/">What to Include</a>
              <a href="/blog/invoice-vs-receipt-difference/">Invoice vs Receipt</a>
              <a href="/blog/best-payment-terms-freelancers/">Payment Terms</a>
            </div>
          </details>

          {/* Column 3: Company */}
          <details open={isDesktop} className="footer-col">
            <summary className="footer-summary">Company</summary>
            <div className="footer-links">
              <a href="/about/">About</a>
              <a href="/contact/">Contact</a>
              <a href="/privacy/">Privacy Policy</a>
              <a href="/terms/">Terms of Service</a>
            </div>
          </details>
        </div>

        {/* Bottom Section: Copyright */}
        <div style={{ 
          borderTop: '1px solid var(--color-border)', 
          paddingTop: '24px', 
          display: 'flex', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          color: 'var(--color-text-tertiary)',
          fontSize: '13px'
        }}>
          <span>&copy; {new Date().getFullYear()} Invoice-Gen.net. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Security verified. Local browser storage only.
          </span>
        </div>
      </div>

      <style>{`
        .footer-col {
          width: 100%;
        }
        .footer-summary {
          color: var(--color-text-main);
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 16px;
          cursor: pointer;
          outline: none;
          list-style: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-summary::-webkit-details-marker {
          display: none;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-links a {
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: color 0.15s ease;
          font-size: 14px;
        }
        .footer-links a:hover {
          color: var(--color-text-main);
        }
        
        @media (max-width: 768px) {
          .footer-summary {
            padding: 12px 0;
            border-bottom: 1px solid var(--color-border);
            margin-bottom: 8px;
          }
          .footer-summary::after {
            content: '+';
            font-size: 16px;
            color: var(--color-text-tertiary);
          }
          details[open] .footer-summary::after {
            content: '−';
          }
          .footer-links {
            padding: 8px 0 16px 8px;
          }
        }

        @media (min-width: 769px) {
          .footer-summary {
            pointer-events: none;
            cursor: default;
          }
        }
      `}</style>
    </footer>
  );
};
