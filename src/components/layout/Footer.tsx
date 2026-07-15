import React, { useState, useEffect } from 'react';
import { Logo } from '../ui/Logo';

/* Inline SVG social icons for pixel-perfect control */
const SocialIcon = ({ d, viewBox = '0 0 24 24', label }: { d: string; viewBox?: string; label: string }) => (
  <svg width="18" height="18" viewBox={viewBox} fill="currentColor" aria-label={label}>
    <path d={d} />
  </svg>
);

const socials = [
  {
    label: 'Facebook',
    href: '#',
    d: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
  },
  {
    label: 'Instagram',
    href: '#',
    d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    label: 'LinkedIn',
    href: '#',
    d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'YouTube',
    href: '#',
    d: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
];

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Premium Custom SVG Logo */}
              <svg width="40" height="45" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 166, 90, 0.2))' }}>
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
                
                {/* Blue accent lines glowing */}
                <rect x="-6" y="16" width="8" height="2.5" rx="1.25" fill="#0084FF" style={{ filter: 'drop-shadow(0px 0px 4px rgba(0, 132, 255, 0.6))' }}/>
                <rect x="-6" y="22" width="12" height="2.5" rx="1.25" fill="#0084FF" style={{ filter: 'drop-shadow(0px 0px 4px rgba(0, 132, 255, 0.6))' }}/>
                <rect x="-6" y="28" width="8" height="2.5" rx="1.25" fill="#0084FF" style={{ filter: 'drop-shadow(0px 0px 4px rgba(0, 132, 255, 0.6))' }}/>
              </svg>
              <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'Inter, sans-serif' }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#333333', letterSpacing: '-0.5px' }}>Invoice-Gen</span>
                <span style={{ fontSize: '18px', fontWeight: 500, color: '#666666' }}>.net</span>
              </div>
            </div>
            {/* Social icons under logo */}
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

        {/* Bottom Section: Copyright + Social repeat */}
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Invoice-Gen.net. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
