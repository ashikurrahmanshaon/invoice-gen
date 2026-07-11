import React from 'react';

interface LogoProps {
  size?: number;
  color?: string;
  hideText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, hideText = false }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
      >
        <defs>
          <linearGradient id="logo-accent-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <linearGradient id="logo-back-grad" x1="4" y1="20" x2="20" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
          </linearGradient>
        </defs>
        
        {/* Background Layer: Glassmorphic invoice sheet */}
        <rect 
          x="4" 
          y="8" 
          width="18" 
          height="20" 
          rx="4" 
          fill="url(#logo-back-grad)" 
          stroke="rgba(255, 255, 255, 0.15)" 
          strokeWidth="1.5" 
        />
        
        {/* Foreground Layer: Overlapping invoice sheet with glowing gradient border */}
        <rect 
          x="10" 
          y="4" 
          width="18" 
          height="20" 
          rx="4" 
          fill="#0B1220" 
          stroke="url(#logo-accent-grad)" 
          strokeWidth="1.75" 
        />
        
        {/* Sleek billing lines inside the foreground sheet */}
        <line x1="14" y1="9" x2="24" y2="9" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="13" x2="20" y2="13" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Bright green status dot representing payment confirmation / success */}
        <circle cx="23" cy="17" r="2" fill="#10B981" />
      </svg>
      
      {!hideText && (
        <span 
          style={{ 
            fontSize: `${size * 0.6}px`, 
            fontWeight: 700, 
            letterSpacing: '-0.03em', 
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Invoice<span style={{ color: '#38BDF8' }}>-Gen</span>
        </span>
      )}
    </div>
  );
};
