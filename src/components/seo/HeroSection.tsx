import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink?: string;
  readTime?: string;
  lastUpdated?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  title, 
  subtitle, 
  ctaText,
  ctaLink = '/#generator',
  readTime,
  lastUpdated
}) => {
  return (
    <div className="hero" style={{ textAlign: 'center', marginBottom: '48px' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '24px', color: '#0F172A', lineHeight: 1.15 }}>
        {title}
      </h1>
      <p className="subtitle" style={{ fontSize: '20px', color: '#334155', marginBottom: '32px', lineHeight: 1.8, letterSpacing: '-0.01em', maxWidth: '800px', margin: '0 auto' }}>
        {subtitle}
      </p>
      
      {/* Action button in Hero */}
      <div style={{ marginTop: '32px', marginBottom: '24px' }}>
        <a href={ctaLink} className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '18px' }}>
          {ctaText}
        </a>
      </div>

      {(readTime || lastUpdated) && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '24px', 
          fontSize: '14px', 
          color: '#64748B',
          marginTop: '24px'
        }}>
          {readTime && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {readTime} read
            </span>
          )}
          {lastUpdated && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Updated {lastUpdated}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
