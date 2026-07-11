import React from 'react';
import { Shield, Zap, FileText } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
  onLoadDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStart, onLoadDemo }) => {
  return (
    <div style={{
      background: 'radial-gradient(ellipse at top, #0B1220 0%, #030712 100%)',
      color: '#FFFFFF',
      borderRadius: 'var(--radius-xl)',
      padding: '80px 40px 60px 40px',
      margin: '24px 0 40px 0',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid #1E293B',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Decorative Grid Mesh */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        opacity: 0.8,
        zIndex: 1
      }} />

      {/* Glowing Backdrop */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, rgba(0, 0, 0, 0) 70%)',
        top: '-150px',
        left: 'calc(50% - 200px)',
        zIndex: 2
      }} />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 3, maxWidth: '800px', margin: '0 auto' }}>
        {/* Trust Badge Pin */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.15)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#38BDF8',
          marginBottom: '24px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <span>✓ Browser-Native Privacy Sandbox</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: '1.15',
          color: '#FFFFFF',
          margin: '0 0 16px 0',
          fontFamily: 'Inter, sans-serif'
        }}>
          Free Professional <br />
          <span style={{ 
            background: 'linear-gradient(to right, #38BDF8, #818CF8, #4F46E5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            Invoice Generator
          </span>
        </h1>

        {/* Hero Subheadline */}
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          color: '#98A2B3',
          margin: '0 0 40px 0',
          fontWeight: 500
        }}>
          100% Free &bull; Secure &bull; No Sign-Up Required &bull; Browser-Based &bull; Instant PDF Download
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '50px'
        }}>
          <button 
            onClick={onStart}
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '0 32px',
              height: '52px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              transition: 'transform 150ms ease, opacity 150ms ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Create Free Invoice
          </button>
          
          <button 
            onClick={onLoadDemo}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0 32px',
              height: '52px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            See Live Demo
          </button>
        </div>

        {/* Three Grid Cards: Features & Trust */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '40px'
        }}>
          {/* Card 1 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', marginBottom: '16px' }}>
              <Shield size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 8px 0' }}>100% Privacy-First</h3>
            <p style={{ fontSize: '13px', color: '#98A2B3', margin: 0, lineHeight: 1.5 }}>
              Zero servers or databases. Your client listings and financials remain stored purely inside your browser memory.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '8px', background: 'rgba(129, 140, 248, 0.1)', color: '#818CF8', marginBottom: '16px' }}>
              <Zap size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 8px 0' }}>Zero Signup Friction</h3>
            <p style={{ fontSize: '13px', color: '#98A2B3', margin: 0, lineHeight: 1.5 }}>
              No email verification prompts, recurring payment models, or trial expiration delays. Start drafting instantly.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '8px', background: 'rgba(79, 70, 229, 0.1)', color: '#a5b4fc', marginBottom: '16px' }}>
              <FileText size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 8px 0' }}>Watermark-Free PDF</h3>
            <p style={{ fontSize: '13px', color: '#98A2B3', margin: 0, lineHeight: 1.5 }}>
              SaaS-grade professional templates ready for procurement audits, without branding advertisements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
