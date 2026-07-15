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
        className="preview-paper-container"
        style={{ 
          width: '100%', 
          flex: 1, 
          backgroundColor: '#FFFFFF', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '10px 0',
          cursor: 'pointer',
          borderRadius: '12px',
          border: '1px solid var(--color-border)'
        }}
        onClick={onOpenFullPreview}
        title="Click to expand"
      >
        <div style={{ pointerEvents: 'none' }}>
          <InvoiceA4Preview data={data} scale={scale} />
        </div>
      </div>

      {/* Trust Badge */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '6px', 
        padding: '10px 0',
        fontSize: '12px',
        color: 'var(--color-text-tertiary)',
        fontWeight: 400
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Your data never leaves your browser
      </div>
    </div>
  );
};
