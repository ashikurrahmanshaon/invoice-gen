import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { InvoiceData } from '../../types/invoice';
import { InvoiceA4Preview } from './InvoiceA4Preview';

interface FullPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvoiceData;
  onDownloadPDF: () => void;
}

export const FullPreviewModal: React.FC<FullPreviewModalProps> = ({ isOpen, onClose, data, onDownloadPDF }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  const isDragging = touchStart !== null && touchCurrent !== null;
  const dragDistance = isDragging ? Math.max(0, touchCurrent - touchStart) : 0;
  
  // Calculate fit-width scale
  const [fitScale, setFitScale] = useState(0.8);

  // Handle ESC
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Dynamic initial sizing to fit width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const isMobile = window.innerWidth <= 768;
        const padding = isMobile ? 32 : 80;
        const availableWidth = containerRef.current.clientWidth - padding;
        const targetScale = Math.min(1.5, availableWidth / 800);
        setFitScale(targetScale);
      }
    };
    
    if (isOpen) {
      setTimeout(updateWidth, 50);
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, [isOpen]);

  // Touch handlers for drag-to-dismiss (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart !== null) {
      setTouchCurrent(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    if (dragDistance > 100) {
      onClose();
    }
    setTouchStart(null);
    setTouchCurrent(null);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <style>{`
        @media (max-width: 768px) {
          .full-preview-backdrop {
            padding: 0 !important;
            align-items: flex-end !important;
          }
          .full-preview-card {
            height: 96dvh !important;
            max-height: 96dvh !important;
            border-radius: 24px 24px 0 0 !important;
            width: 100vw !important;
            animation: slideUpSheet 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        }
        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      <div 
        className="full-preview-backdrop"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100dvh',
          backgroundColor: 'rgba(15, 23, 42, 0.4)', // Softer backdrop
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px',
          transition: 'opacity 0.3s ease'
        }}
      >
        <div 
          ref={modalRef}
          className="full-preview-card"
          style={{
            width: '100%',
            maxWidth: '1200px',
            height: '92vh',
            backgroundColor: '#F8FAFC',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            transform: isDragging ? `translateY(${dragDistance}px)` : 'translateY(0)',
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Mobile Drag Handle */}
          <div 
            className="mobile-only" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '16px', paddingBottom: '8px', cursor: 'grab', zIndex: 10 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div style={{ width: '48px', height: '5px', backgroundColor: '#CBD5E1', borderRadius: '3px' }} />
          </div>

          <TransformWrapper
            initialScale={fitScale}
            minScale={0.3}
            maxScale={3}
            centerOnInit
            wheel={{ step: 0.1 }}
            doubleClick={{ mode: 'reset' }}
          >
            {({ zoomIn, zoomOut, setTransform, state }) => {
              // Update initial scale when fitScale changes, but only if we haven't zoomed
              // A bit complex without a wrapper, so we just use the UI buttons to reset
              const handleFitWidth = () => {
                setTransform(0, 0, fitScale, 200, "easeOut");
              };
              
              return (
                <>
                  {/* Desktop Toolbar */}
                  <div className="desktop-only" style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    padding: '16px 24px',
                    gap: '12px',
                    zIndex: 10,
                    backgroundColor: '#F8FAFC',
                    borderBottom: '1px solid #E2E8F0'
                  }}>
                    <button className="btn btn-ghost" onClick={() => zoomOut(0.25)} style={{ padding: '8px' }}>
                      <ZoomOut size={20} />
                    </button>
                    <span style={{ fontSize: '14px', fontWeight: 500, minWidth: '48px', textAlign: 'center' }}>
                      {Math.round(state.scale * 100)}%
                    </span>
                    <button className="btn btn-ghost" onClick={() => zoomIn(0.25)} style={{ padding: '8px' }}>
                      <ZoomIn size={20} />
                    </button>
                    <button className="btn btn-ghost" onClick={handleFitWidth} style={{ padding: '8px 16px', display: 'flex', gap: '8px' }}>
                      <Maximize size={16} /> Fit Width
                    </button>
                    
                    <div style={{ width: '1px', height: '24px', backgroundColor: '#E2E8F0', margin: '0 8px' }} />
                    
                    <button className="btn btn-primary" onClick={onDownloadPDF} style={{ padding: '0 24px', height: '40px' }}>
                      <Download size={18} style={{ marginRight: '8px' }} /> Download PDF
                    </button>
                    <button className="btn btn-ghost" onClick={onClose} style={{ padding: '8px', marginLeft: '8px' }}>
                      <X size={24} />
                    </button>
                  </div>

                  {/* Mobile Actions Overlay */}
                  <div className="mobile-only" style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    padding: '20px', 
                    zIndex: 10,
                    background: 'linear-gradient(to top, #F8FAFC 60%, transparent)'
                  }}>
                     <button className="btn btn-primary" onClick={onDownloadPDF} style={{ padding: '0 24px', height: '52px', width: '100%', borderRadius: '12px', fontSize: '16px' }}>
                      <Download size={20} style={{ marginRight: '8px' }} /> Download PDF
                    </button>
                  </div>

                  {/* Paper Container */}
                  <div 
                    ref={containerRef} 
                    style={{ 
                      flex: 1, 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      backgroundColor: '#F8FAFC',
                      overflow: 'hidden'
                    }}
                  >
                    <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ padding: '40px' }}>
                      <div style={{ 
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
                        borderRadius: '2px', // Minimal paper radius
                        overflow: 'hidden'
                      }}>
                        <InvoiceA4Preview data={data} scale={1} />
                      </div>
                    </TransformComponent>
                  </div>
                </>
              );
            }}
          </TransformWrapper>
        </div>
      </div>
    </>,
    document.body
  );
};
