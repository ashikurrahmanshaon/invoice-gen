import React, { useRef, useEffect, useState } from 'react';
import type { InvoiceData } from '../../types/invoice';
import { InvoiceA4Preview } from './InvoiceA4Preview';

interface PreviewSidebarProps {
  data: InvoiceData;
  onOpenFullPreview: () => void;
}

export const PreviewSidebar: React.FC<PreviewSidebarProps> = ({ data, onOpenFullPreview }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Base width of the paper is 800px
        const availableWidth = entry.contentRect.width;
        // Keep a little padding (e.g., 20px total)
        const targetWidth = availableWidth - 20; 
        setScale(targetWidth / 800);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="workspace-sidebar desktop-only" 
      style={{ 
        position: 'sticky', 
        top: '84px', 
        alignSelf: 'flex-start', 
        width: '480px',
        height: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div 
        ref={containerRef}
        style={{ 
          width: '100%', 
          flex: 1, 
          backgroundColor: '#F8FAFC', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '10px 0',
          cursor: 'pointer',
          borderRadius: '12px'
        }}
        onClick={onOpenFullPreview}
        title="Click to expand"
      >
        <div style={{ pointerEvents: 'none' }}>
          <InvoiceA4Preview data={data} scale={scale} />
        </div>
      </div>
    </div>
  );
};
