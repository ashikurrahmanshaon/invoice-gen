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
    <footer id="main-footer" className="app-footer">
      <div className="container flex-col" style={{ gap: '48px' }}>
        
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="flex items-center gap-2">
              <Logo size={24} hideText={true} />
              <span className="footer-brand-name">
                Invoice-Gen.net
              </span>
            </div>
            <p className="footer-brand-desc">
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
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Invoice-Gen.net. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
