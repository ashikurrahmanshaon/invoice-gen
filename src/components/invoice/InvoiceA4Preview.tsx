import React from 'react';
import type { InvoiceData } from '../../types/invoice';
import i18next from 'i18next';
import { PremiumLayout } from './layouts/PremiumLayout';

interface InvoiceA4PreviewProps {
  data: InvoiceData;
  scale?: number;
}

export const InvoiceA4Preview: React.FC<InvoiceA4PreviewProps> = ({ data, scale = 1 }) => {
  const BASE_WIDTH = 800;
  const A4_ASPECT_RATIO = 1.414;
  

  return (
    <div 
      style={{
        width: `${BASE_WIDTH * scale}px`,
        position: 'relative',
        flexShrink: 0,
        height: `${BASE_WIDTH * A4_ASPECT_RATIO * scale}px`,
      }}
    >
      <div 
        style={{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_WIDTH * A4_ASPECT_RATIO}px`,
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
          padding: '64px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          boxSizing: 'border-box',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#0F172A',
          direction: i18next.dir(),
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <PremiumLayout data={data} />
      </div>
    </div>
  );
};
