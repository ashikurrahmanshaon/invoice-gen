import React from 'react';
import { Link } from 'react-router-dom';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <header style={{ 
        background: 'rgba(255, 255, 255, 0.75)', 
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)', 
        height: '60px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4H20L26 10V28H6V4Z" fill="#4F46E5" />
            <path d="M20 4V10H26L20 4Z" fill="#06B6D4" />
            <line x1="10" y1="15" x2="22" y2="15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <line x1="10" y1="20" x2="22" y2="20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <line x1="10" y1="24" x2="16" y2="24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '-0.04em', fontFamily: 'Outfit, Inter, sans-serif' }}>
            Invoice<span style={{ color: '#06B6D4' }}>-Gen</span>
          </span>
        </Link>
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/templates" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>Templates</Link>
          <Link to="/blog" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>Guides</Link>
          <Link to="/" style={{ textDecoration: 'none', background: '#4F46E5', color: '#FFFFFF', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 500 }}>Create Invoice</Link>
        </nav>
      </header>

      <main style={{ flex: 1, padding: '40px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      <footer style={{ background: '#0F172A', color: '#94A3B8', padding: '60px 24px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '16px', fontSize: '18px' }}>Invoice-Gen.net</div>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>The 100% free, secure, browser-based invoice generator for freelancers and small businesses.</p>
          </div>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 600, marginBottom: '16px' }}>Templates</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/templates/freelance" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px' }}>Freelance Invoice</Link>
              <Link to="/templates/consultant" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px' }}>Consultant Invoice</Link>
              <Link to="/templates/contractor" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px' }}>Contractor Invoice</Link>
              <Link to="/templates/software" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px' }}>Software Development</Link>
            </div>
          </div>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 600, marginBottom: '16px' }}>Resources</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/blog" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px' }}>Blog</Link>
              <Link to="/compare" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px' }}>Compare</Link>
              <Link to="/about" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px' }}>About Us</Link>
            </div>
          </div>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 600, marginBottom: '16px' }}>Legal</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/privacy" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px' }}>Terms of Service</Link>
              <Link to="/trust" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px' }}>Trust Center</Link>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '24px', borderTop: '1px solid #1E293B', textAlign: 'center', fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} Invoice-Gen.net. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
