import React from 'react';

interface LogoProps {
  size?: number;
  hideText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, hideText = false }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'inherit' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
      >
        {/* Sleek solid Indigo document sheet */}
        <path 
          d="M6 4H20L26 10V28H6V4Z" 
          fill="#4F46E5" 
        />
        {/* Elegant solid Cyan top-right fold accent */}
        <path 
          d="M20 4V10H26L20 4Z" 
          fill="#06B6D4" 
        />
        {/* Horizontal text lines representing billing data */}
        <line x1="10" y1="15" x2="22" y2="15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="20" x2="22" y2="20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="24" x2="16" y2="24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
      
      {!hideText && (
        <span 
          style={{ 
            fontSize: `${size * 0.55}px`, 
            fontWeight: 800, 
            letterSpacing: '-0.04em', 
            color: 'inherit',
            fontFamily: "'Outfit', 'Inter', 'Inter Fallback', sans-serif",
            lineHeight: 1
          }}
        >
          Invoice<span style={{ color: '#06B6D4' }}>-Gen</span>
        </span>
      )}
    </div>
  );
};
