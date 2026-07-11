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
        <defs>
          <linearGradient id="logo-premium-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        
        {/* Sleek Outer rounded container */}
        <rect 
          x="3" 
          y="3" 
          width="26" 
          height="26" 
          rx="8" 
          fill="#0B132B" 
          stroke="url(#logo-premium-grad)" 
          strokeWidth="2" 
        />
        
        {/* Clean checkmark representing approved/processed billing */}
        <path 
          d="M10 15L14 19L22 11" 
          stroke="url(#logo-premium-grad)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Document line representing transaction total */}
        <line 
          x1="10" 
          y1="23" 
          x2="22" 
          y2="23" 
          stroke="#94A3B8" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
      </svg>
      
      {!hideText && (
        <span 
          style={{ 
            fontSize: `${size * 0.55}px`, 
            fontWeight: 800, 
            letterSpacing: '-0.04em', 
            color: 'inherit',
            fontFamily: 'Outfit, Inter, sans-serif',
            lineHeight: 1
          }}
        >
          Invoice<span style={{ color: '#06B6D4' }}>-Gen</span>
        </span>
      )}
    </div>
  );
};
