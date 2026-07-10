import React from 'react';

interface AdSlotProps {
  width: number | string;
  height: number | string;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ width, height, className = '' }) => {
  return (
    <div 
      className={`ad-slot ${className}`}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        backgroundColor: '#F2F4F7',
        border: '1px dashed #D0D5DD',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#98A2B3',
        fontSize: '12px'
      }}
    >
      <span style={{ fontWeight: 500 }}>ADVERTISEMENT</span>
      <span>{width} x {height}</span>
    </div>
  );
};
