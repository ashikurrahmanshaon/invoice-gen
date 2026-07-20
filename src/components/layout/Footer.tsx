import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/* Inline SVG social icons for pixel-perfect control */
const SocialIcon = ({ d, viewBox = '0 0 24 24', label }: { d: string; viewBox?: string; label: string }) => (
  <svg width="18" height="18" viewBox={viewBox} fill="currentColor" aria-label={label}>
    <path d={d} />
  </svg>
);

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/invoice-gen',
    d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/invoice_gen',
    d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
];

export const Footer: React.FC = () => {
  const { t } = useTranslation();
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
    <footer id="main-footer" className="app-footer desktop-only">
      <div className="container flex-col" style={{ gap: '48px' }}>
        
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Premium Custom SVG Logo */}
              <svg width="40" height="45" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 166, 90, 0.2))' }} role="img" aria-label="Invoice-Gen.net Logo">
                <defs>
                  <linearGradient id="docGradientFooter" x1="0" y1="0" x2="32" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00E676" />
                    <stop offset="1" stopColor="#00A65A" />
                  </linearGradient>
                  <linearGradient id="foldGradientFooter" x1="16" y1="0" x2="32" y2="10" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00C853" />
                    <stop offset="1" stopColor="#007936" />
                  </linearGradient>
                </defs>
                <path d="M14 0H28C30.2091 0 32 1.79086 32 4V32C32 34.2091 30.2091 36 28 36H4C1.79086 36 0 34.2091 0 32V10L14 0Z" fill="url(#docGradientFooter)"/>
                <path d="M0 10H10C12.2091 10 14 8.20914 14 6V0L0 10Z" fill="url(#foldGradientFooter)"/>
                
                <rect x="2" y="16" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9"/>
                <rect x="2" y="22" width="22" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9"/>
                <rect x="2" y="28" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9"/>
              </svg>
              <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'Inter, sans-serif' }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#333333', letterSpacing: '-0.5px' }}>Invoice<span style={{ color: '#00E676' }}>-Gen</span></span>
                <span style={{ fontSize: '18px', fontWeight: 500, color: '#666666' }}>.net</span>
              </div>
            </div>
            <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6', marginTop: '16px', marginBottom: '24px', maxWidth: '280px' }}>
              Create professional, elegant invoices in seconds. 100% free, secure, and designed for modern businesses.
            </p>
            {/* Social icons under logo — only verified, real profiles */}
            <div className="footer-socials">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-social-link"
                  title={s.label}
                >
                  <SocialIcon d={s.d} label={s.label} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 1: Product — only links to real, working routes */}
          <details open={isDesktop} className="footer-col desktop-only">
            <summary className="footer-summary">{t('footer.product', 'Product')}</summary>
            <div className="footer-links">
              <Link to="/">{t('footer.invoiceGenerator', 'Invoice Generator')}</Link>
              <Link to="/purchase-order-generator">{t('footer.purchaseOrder', 'Purchase Order Generator')}</Link>
              <Link to="/quote-generator">{t('footer.quoteGenerator', 'Quote Generator')}</Link>
              <Link to="/estimate-generator">{t('footer.estimateGenerator', 'Estimate Generator')}</Link>
              <Link to="/templates">{t('footer.templates', 'Templates')}</Link>
            </div>
          </details>

          {/* Column 2: Resources — links to real content pages */}
          <details open={isDesktop} className="footer-col desktop-only">
            <summary className="footer-summary">{t('footer.resources', 'Resources')}</summary>
            <div className="footer-links">
              <Link to="/blog/how-to-create-an-invoice">How to Create an Invoice</Link>
              <Link to="/blog/how-to-write-an-invoice">How to Write an Invoice</Link>
              <Link to="/blog/invoice-vs-receipt">Invoice vs Receipt</Link>
              <Link to="/blog/payment-terms-explained">Payment Terms Explained</Link>
              <Link to="/blog">All Guides</Link>
            </div>
          </details>

          {/* Column 3: Guides (SEO) — links to real content pages */}
          <details open={isDesktop} className="footer-col desktop-only">
            <summary className="footer-summary">{t('footer.invoiceTypes', 'Invoice Guides')}</summary>
            <div className="footer-links">
              <Link to="/invoice-types/proforma-invoice">Proforma Invoice</Link>
              <Link to="/blog/commercial-invoice">Commercial Invoice</Link>
              <Link to="/blog/tax-invoice">Tax Invoice</Link>
              <Link to="/blog/vat-invoice-guide">VAT Invoice Guide</Link>
              <Link to="/blog/invoice-vs-bill">Invoice vs Bill</Link>
            </div>
          </details>

          {/* Column 4: Templates — links to real template pages */}
          <details open={isDesktop} className="footer-col desktop-only">
            <summary className="footer-summary">{t('footer.freeTools', 'Templates')}</summary>
            <div className="footer-links">
              <Link to="/templates/freelance">Freelance</Link>
              <Link to="/templates/contractor">Contractor</Link>
              <Link to="/templates/consulting">Consulting</Link>
              <Link to="/templates/construction">Construction</Link>
              <Link to="/templates/cleaning-service">Cleaning Service</Link>
            </div>
          </details>

          {/* Column 5: Company */}
          <details open={isDesktop} className="footer-col desktop-only">
            <summary className="footer-summary">{t('footer.company', 'Company')}</summary>
            <div className="footer-links">
              <Link to="/about">{t('footer.about', 'About')}</Link>
              <Link to="/contact">{t('footer.contact', 'Contact')}</Link>
              <Link to="/blog">{t('footer.blog', 'Blog')}</Link>
              <Link to="/privacy">{t('footer.privacy', 'Privacy Policy')}</Link>
              <Link to="/terms">{t('footer.terms', 'Terms of Service')}</Link>
            </div>
          </details>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Invoice-Gen.net. {t('footer.allRightsReserved', 'All rights reserved.')}</span>
        </div>
      </div>
    </footer>
  );
};
