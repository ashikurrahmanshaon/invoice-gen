import React from 'react';

interface LogoProps {
  size?: number;
  hideText?: boolean;
  monochrome?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, hideText = false, monochrome = false }) => {
  // Use a CSS transform scale to visually increase the logo size without pushing out the layout
  // because the source images have significant transparent padding.
  const scaleFactor = 1.8;

  if (hideText) {
    return (
      <div style={{ width: size, height: size, overflow: 'visible', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src="/logo-icon.png" 
          alt="Logo" 
          style={{ 
            height: size, 
            width: size, 
            objectFit: 'contain',
            transform: `scale(${scaleFactor})`,
            filter: monochrome ? 'grayscale(100%) brightness(200%)' : 'none'
          }} 
        />
      </div>
    );
  }
  
  return (
    <img 
      src="/logo-full.png" 
      alt="Invoice-Gen.net" 
      style={{ 
        height: size, 
        objectFit: 'contain',
        transform: `scale(${scaleFactor})`,
        transformOrigin: 'left center',
        filter: monochrome ? 'grayscale(100%) brightness(200%)' : 'none'
      }} 
    />
  );
};
