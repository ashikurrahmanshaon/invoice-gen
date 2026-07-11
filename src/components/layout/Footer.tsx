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
              <Logo size={24} />
              <span className="font-bold text-lg" style={{ color: 'white' }}>Invoice-Gen</span>
            </div>
            <p style={{ maxWidth: '260px', color: '#667085', lineHeight: 1.5 }}>
              Professional invoices. Free, fast, and simple.
            </p>
          </div>
          
          {/* Navigation Columns */}
          <div style={{ display: 'flex', gap: 'var(--space-10)', flexWrap: 'wrap', justifyContent: 'space-between', flex: 1 }}>
            <div className="flex-col gap-2" style={{ minWidth: '140px' }}>
              <span style={{ color: 'white', fontWeight: 600, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '1px' }}>Product</span>
              <a href="/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Invoice Generator</a>
              <a href="#how-it-works" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">How It Works</a>
              <a href="#faq" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">FAQ</a>
              <a href="/about/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">About Us</a>
              <a href="/contact/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Contact</a>
              <a href="/trust/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Trust Center</a>
              <a href="/privacy/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Privacy Policy</a>
              <a href="/terms/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Terms of Service</a>
            </div>

            <div className="flex-col gap-2" style={{ minWidth: '150px' }}>
              <span style={{ color: 'white', fontWeight: 600, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '1px' }}>Templates I</span>
              <a href="/templates/freelance/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Freelance</a>
              <a href="/templates/consultant/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Consultant</a>
              <a href="/templates/contractor/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Contractor</a>
              <a href="/templates/graphic-designer/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Graphic Designer</a>
              <a href="/templates/photographer/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Photographer</a>
              <a href="/templates/web-developer/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Web Developer</a>
              <a href="/templates/marketing-consultant/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Marketing Advisor</a>
              <a href="/templates/virtual-assistant/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Virtual Assistant</a>
            </div>

            <div className="flex-col gap-2" style={{ minWidth: '150px' }}>
              <span style={{ color: 'white', fontWeight: 600, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '1px' }}>Templates II</span>
              <a href="/templates/social-media-manager/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Social Media</a>
              <a href="/templates/cleaning-service/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Cleaning Service</a>
              <a href="/templates/seo-consultant/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">SEO Consultant</a>
              <a href="/templates/digital-marketing/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Digital Marketing</a>
              <a href="/templates/video-editor/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Video Editor</a>
              <a href="/templates/content-creator/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Content Creator</a>
              <a href="/templates/copywriter/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Copywriter</a>
            </div>

            <div className="flex-col gap-2" style={{ minWidth: '220px', maxWidth: '280px' }}>
              <span style={{ color: 'white', fontWeight: 600, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '1px' }}>Guides & Resources</span>
              <a href="/blog/how-to-create-professional-invoice/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Create a Professional Invoice</a>
              <a href="/blog/what-to-include-in-invoice/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">What to Include in Invoices</a>
              <a href="/blog/invoice-vs-receipt-difference/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Invoice vs Receipt Difference</a>
              <a href="/blog/best-payment-terms-freelancers/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Best Payment Terms Guide</a>
              <a href="/blog/how-to-write-freelance-invoice/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">How to Write Freelance Invoice</a>
              <a href="/blog/common-invoice-mistakes-avoid/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Common Invoice Mistakes</a>
              <a href="/blog/how-to-invoice-as-consultant/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">How to Invoice as Consultant</a>
              <a href="/blog/hourly-vs-fixed-price-invoices/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">Hourly vs Fixed Price</a>
              <a href="/blog/when-to-send-invoice/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">When to Send an Invoice</a>
              <a href="/blog/how-to-get-paid-faster-invoices/" style={{ color: '#98A2B3', textDecoration: 'none' }} className="hover:text-white">How to Get Paid Faster</a>
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
