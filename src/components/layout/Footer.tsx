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
    <footer style={{ 
      background: '#0F172A',
      color: '#94A3B8', 
      padding: '24px 0 16px 0',
      fontSize: '13px',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Top Section: Compact branding header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          paddingBottom: '12px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Logo size={20} hideText={true} />
            <span style={{ 
              fontSize: '14px', 
              fontWeight: 800, 
              letterSpacing: '-0.04em', 
              color: '#FFFFFF', 
              fontFamily: "'Outfit', 'Inter', 'Inter Fallback', sans-serif",
              lineHeight: 1
            }}>
              Invoice<span style={{ color: '#06B6D4' }}>-Gen</span>
            </span>
          </div>
          <span style={{ color: '#94A3B8', fontSize: '11.5px' }}>
            100% browser-native utility. Watermark-free invoices.
          </span>
        </div>

        {/* Middle Section: Exactly 4 Columns using Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : '1fr', 
          gap: isDesktop ? '24px' : '12px',
        }}>
          {/* Column 1: Product */}
          <details open={isDesktop} className="footer-col">
            <summary className="footer-summary">Product</summary>
            <div className="footer-links">
              <a href="/">Invoice-Gen</a>
              <a href="/about/">About Us</a>
              <a href="/trust/">Trust Center</a>
              <a href="/privacy/">Privacy Policy</a>
              <a href="/terms/">Terms of Service</a>
            </div>
          </details>

          {/* Column 2: Templates */}
          <details open={isDesktop} className="footer-col">
            <summary className="footer-summary">Templates</summary>
            <div className="footer-links">
              <a href="/templates/freelance/">Freelance</a>
              <a href="/templates/consultant/">Consultant</a>
              <a href="/templates/contractor/">Contractor</a>
              <a href="/templates/graphic-designer/">Graphic Designer</a>
              <a href="/templates/photographer/">Photographer</a>
              
              <details className="footer-sub-details">
                <summary className="footer-sub-summary">View All Templates</summary>
                <div className="footer-sub-links">
                  <a href="/templates/web-developer/">Web Developer</a>
                  <a href="/templates/marketing-consultant/">Marketing Consultant</a>
                  <a href="/templates/virtual-assistant/">Virtual Assistant</a>
                  <a href="/templates/social-media-manager/">Social Media Manager</a>
                  <a href="/templates/cleaning-service/">Cleaning Service</a>
                  <a href="/templates/seo-consultant/">SEO Consultant</a>
                  <a href="/templates/digital-marketing/">Digital Marketing</a>
                  <a href="/templates/video-editor/">Video Editor</a>
                  <a href="/templates/content-creator/">Content Creator</a>
                  <a href="/templates/copywriter/">Copywriter</a>
                </div>
              </details>
            </div>
          </details>

          {/* Column 3: Resources */}
          <details open={isDesktop} className="footer-col">
            <summary className="footer-summary">Resources</summary>
            <div className="footer-links">
              <a href="/blog/how-to-create-professional-invoice/">Create Invoice Guide</a>
              <a href="/blog/what-to-include-in-invoice/">What to Include</a>
              <a href="/blog/invoice-vs-receipt-difference/">Invoice vs Receipt</a>
              <a href="/blog/best-payment-terms-freelancers/">Payment Terms</a>
              <a href="/blog/how-to-write-freelance-invoice/">Freelance Guide</a>
              
              <details className="footer-sub-details">
                <summary className="footer-sub-summary">View All Guides</summary>
                <div className="footer-sub-links">
                  <a href="/blog/common-invoice-mistakes-avoid/">Common Mistakes</a>
                  <a href="/blog/how-to-invoice-as-consultant/">Consultant Guide</a>
                  <a href="/blog/hourly-vs-fixed-price-invoices/">Hourly vs Fixed</a>
                  <a href="/blog/when-to-send-invoice/">When to Send</a>
                  <a href="/blog/how-to-get-paid-faster-invoices/">Get Paid Faster</a>
                  <a href="/blog/invoicing-for-creative-licenses-and-royalties/">Creative Licenses</a>
                  <a href="/blog/handling-down-payments-and-deposits/">Down Payments</a>
                  <a href="/blog/how-to-request-milestone-payments/">Milestone Payments</a>
                  <a href="/blog/what-is-net-30-and-how-to-use-it/">Net 30 Billing</a>
                  <a href="/blog/what-is-a-credit-note-and-how-to-issue/">Credit Notes</a>
                </div>
              </details>
            </div>
          </details>

          {/* Column 4: Company */}
          <details open={isDesktop} className="footer-col">
            <summary className="footer-summary">Company</summary>
            <div className="footer-links">
              <a href="/about/">About Us</a>
              <a href="/contact/">Contact Us</a>
              <a href="/trust/">Trust Center</a>
              <a href="/privacy/">Privacy Policy</a>
              <a href="/terms/">Terms of Service</a>
            </div>
          </details>
        </div>

        {/* Bottom Section: Copyright */}
        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          paddingTop: '8px', 
          display: 'flex', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          color: '#94A3B8',
          fontSize: '11px'
        }}>
          <span>&copy; {new Date().getFullYear()} Invoice-Gen. All rights reserved.</span>
          <span>Security verified. Local browser storage only.</span>
        </div>
      </div>

      <style>{`
        .footer-col {
          width: 100%;
        }
        .footer-summary {
          color: #FFFFFF;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
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
          gap: 6px;
        }
        .footer-links a {
          color: #94A3B8;
          text-decoration: none;
          transition: color 0.15s ease;
          font-size: 12.5px;
        }
        .footer-links a:hover {
          color: #FFFFFF;
        }

        .footer-sub-details {
          margin-top: 4px;
        }
        .footer-sub-summary {
          font-size: 11.5px;
          color: #06B6D4;
          font-weight: 500;
          cursor: pointer;
          list-style: none;
          outline: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.15s ease;
        }
        .footer-sub-summary:hover {
          color: #22D3EE;
        }
        .footer-sub-summary::-webkit-details-marker {
          display: none;
        }
        .footer-sub-summary::after {
          content: '→';
          font-size: 10px;
          transition: transform 0.2s;
        }
        .footer-sub-details[open] .footer-sub-summary::after {
          transform: rotate(90deg);
        }
        .footer-sub-links {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 4px 0 0 8px;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: 4px;
        }
        
        @media (max-width: 768px) {
          .footer-summary {
            padding: 6px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            margin-bottom: 4px;
          }
          .footer-summary::after {
            content: '+';
            font-size: 12px;
            color: #64748B;
          }
          details[open] .footer-summary::after {
            content: '−';
          }
          .footer-links {
            padding: 4px 0 12px 6px;
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
