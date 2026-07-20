import React from 'react';
import type { InvoiceData } from '../../types/invoice';
import i18next from 'i18next';
import { PremiumLayout } from './layouts/PremiumLayout';
import { HourlyLayout } from './layouts/HourlyLayout';
import { CoffeeShopLayout } from './layouts/CoffeeShopLayout';

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
          minHeight: `${BASE_WIDTH * A4_ASPECT_RATIO}px`,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
          
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
        {data.details.layoutId === 'hourly' ? (
          <HourlyLayout data={data} isCompact={false} />
        ) : data.details.layoutId === 'coffee-shop' ? (
          <CoffeeShopLayout data={data} isCompact={false} />
        ) : (
          <PremiumLayout data={data} />
        )}
      </div>
    </div>
  );
};
