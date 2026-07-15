import React, { useRef, useState, useEffect } from 'react';
import type { InvoiceData } from '../../types/invoice';
import { InvoiceA4Preview } from './InvoiceA4Preview';
import { LayoutTemplate } from 'lucide-react';

interface PreviewSidebarProps {
  data: InvoiceData;
  onOpenFullPreview: () => void;
  onOpenSettings: () => void;
  onOpenTemplateGallery: () => void;
}

export const PreviewSidebar: React.FC<PreviewSidebarProps> = ({ data, onOpenFullPreview, onOpenTemplateGallery }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const availableWidth = entry.contentRect.width;
        const availableHeight = entry.contentRect.height;
        // Maximize the fit inside the box by removing the 48px padding subtraction
        const scaleW = (availableWidth - 16) / 800; // Just a tiny 8px margin
        const scaleH = (availableHeight - 16) / (800 * 1.414); 
        
        setScale(Math.min(scaleW, scaleH));
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
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 8px' }}>

        <button 
          onClick={onOpenTemplateGallery}
          style={{
            height: '32px',
            backgroundColor: '#F1F5F9',
            color: '#475467',
            fontWeight: 600,
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '6px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E2E8F0'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
        >
          <LayoutTemplate size={14} /> See Templates
        </button>
      </div>
      <div 
        ref={containerRef}
        style={{ 
          width: '100%', 
          flex: 1, 
          backgroundColor: '#F8FAFC',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', // Vertically center the paper!
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '8px', // Minimal breathing room to maximize size
          borderRadius: '24px', // Softer corners
          border: '1px solid #E2E8F0',
          position: 'relative',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
        }}
      >

        <div 
          onClick={onOpenFullPreview}
          style={{ 
            pointerEvents: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#fff',
            cursor: 'zoom-in',
          }}
        >
          <div style={{ pointerEvents: 'none' }}>
            <InvoiceA4Preview data={data} scale={scale} />
          </div>
        </div>
      </div>



    </div>
  );
};
