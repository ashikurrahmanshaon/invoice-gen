import React from 'react';

interface LogoProps {
  size?: number;
  hideText?: boolean;
  monochrome?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, hideText = false, monochrome = false }) => {
  const bgColor = monochrome ? 'currentColor' : '#2563EB';
  const docColor = monochrome ? 'var(--color-surface, #FFFFFF)' : '#FFFFFF';
  const lineColor = monochrome ? 'currentColor' : '#2563EB';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'inherit' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      >
        <rect width="32" height="32" rx="8" fill={bgColor} />
        <rect x="10" y="8" width="12" height="16" rx="2" fill={docColor} />
        <rect x="13" y="12" width="6" height="2" rx="1" fill={lineColor} />
        <rect x="13" y="16" width="4" height="2" rx="1" fill={lineColor} />
      </svg>
      
      {!hideText && (
        <span 
          style={{ 
            fontSize: `${size * 0.55}px`, 
            fontWeight: 800, 
            letterSpacing: '-0.03em', 
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1,
            display: 'flex',
            alignItems: 'baseline'
          }}
        >
          <span style={{ color: monochrome ? 'inherit' : '#0F172A' }}>Invoice-</span>
          <span style={{ color: monochrome ? 'inherit' : '#2563EB' }}>Gen.net</span>
        </span>
      )}
    </div>
  );
};
