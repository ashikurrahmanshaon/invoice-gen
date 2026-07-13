import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface HeroSectionProps {
  onLoadDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLoadDemo }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hidden = localStorage.getItem('hide_welcome_banner');
    if (hidden === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('hide_welcome_banner', 'true');
    setIsVisible(false);
  };

  // We toggle display via inline style so it remains present in the DOM/HTML markup for search engine crawlers
  return (
    <div 
      style={{
        display: isVisible ? 'block' : 'none',
        background: 'radial-gradient(ellipse at top, #0F172A 0%, #020617 100%)',
        color: '#FFFFFF',
        borderRadius: '12px',
        padding: '20px 24px',
        margin: '16px 0 24px 0',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #1E293B',
        boxShadow: 'var(--shadow-md)'
      }}
      className="welcome-banner animate-fade-in"
    >
      {/* Decorative subtle grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.6,
        zIndex: 1
      }} />

      {/* Dismiss Button */}
      <button 
        onClick={handleDismiss}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'transparent',
          border: 'none',
          color: '#64748B',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          zIndex: 10
        }}
        onMouseOver={(e) => e.currentTarget.style.color = '#FFFFFF'}
        onMouseOut={(e) => e.currentTarget.style.color = '#64748B'}
        aria-label="Dismiss welcome banner"
      >
        <X size={16} />
      </button>

      {/* Main Content Layout */}
      <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.15)',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#38BDF8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              ✓ Browser-Native Privacy Sandbox
            </span>
          </div>
          
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            margin: '0 0 4px 0',
            fontFamily: "'Inter', 'Inter Fallback', sans-serif"
          }}>
            Invoice-Gen — Free Professional Invoice Creator
          </h2>
          
          <p style={{
            fontSize: '13px',
            lineHeight: '1.45',
            color: '#94A3B8',
            margin: 0,
            fontWeight: 400
          }}>
            100% Free &bull; Secure &bull; No Sign-Up &bull; Browser-Based &bull; Instant PDF Download. Your financial data stays locally on your device.
          </p>
        </div>

        {/* Hero Illustration */}
        <div className="hero-illustration" style={{ flex: '1 1 200px', display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '180px' }}>
          <img 
            src="/hero.webp" 
            alt="Invoice-Gen — Free Professional Invoice Creator" 
            fetchPriority="high"
            width="200"
            height="200"
            decoding="async"
            style={{ width: '100%', maxWidth: '200px', height: 'auto', objectFit: 'contain', opacity: 0.9 }} 
          />
        </div>

        {/* Action Button & Demo Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={onLoadDemo}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '0 12px',
              height: '34px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            Load Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
