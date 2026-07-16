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
            height: '46px',
            background: '#ffffff',
            color: '#334155',
            fontWeight: 600,
            fontSize: '14.5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
          onMouseEnter={(e) => { 
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 166, 90, 0.12)';
            e.currentTarget.style.borderColor = '#00A65A';
            e.currentTarget.style.color = '#00A65A';
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.color = '#334155';
          }}
        >
          <LayoutTemplate size={18} strokeWidth={2} /> Browse 100% Free Templates
        </button>
      </div>
      <div 
        ref={containerRef}
        style={{ 
          width: '100%', 
          flex: 1, 
          backgroundColor: '#F8FAFC',
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          position: 'relative',
          boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.02)'
        }}
      >

        <div 
          onClick={onOpenFullPreview}
          style={{ 
            pointerEvents: 'auto',
            boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.05)',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#fff',
            cursor: 'zoom-in',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <div style={{ pointerEvents: 'none' }}>
            <InvoiceA4Preview data={data} scale={scale} />
          </div>
        </div>
      </div>



    </div>
  );
};
