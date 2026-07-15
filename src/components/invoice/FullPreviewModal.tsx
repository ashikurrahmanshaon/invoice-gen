import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, ZoomIn, ZoomOut, Maximize, MessageCircle, Mail, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { toJpeg } from 'html-to-image';
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

  const handleShare = async (platform: 'whatsapp' | 'email' | 'messenger') => {
    const text = `Invoice ${data.details.invoiceNumber || ''} for ${data.totals.total} ${data.details.currency} from ${data.business.name || 'our business'}`;
    
    // Use Web Share API if available and user is on mobile
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      try {
        await navigator.share({ title: 'Invoice', text });
        return;
      } catch (err) {
        console.log('Native share failed or was cancelled', err);
      }
    }

    // Fallbacks
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'email') {
      window.open(`mailto:?subject=${encodeURIComponent('Invoice from ' + (data.business.name || 'Us'))}&body=${encodeURIComponent(text + '\n\nPlease find attached or linked invoice.')}`, '_blank');
    } else if (platform === 'messenger') {
      // Messenger doesn't have a simple text sharing intent without a URL, fallback to clipboard or generic share
      alert('To share via Messenger on desktop, please download the PDF or JPG and attach it.');
    }
  };

  const handleDownloadJPG = async () => {
    const paperEl = document.getElementById('preview-paper-wrapper');
    if (!paperEl) return;
    
    // Temporarily add a class to ensure crisp rendering
    paperEl.style.transform = 'scale(2)';
    paperEl.style.transformOrigin = 'top left';
    paperEl.style.width = '800px';
    
    try {
      // Small delay to let browser reflow
      await new Promise(r => setTimeout(r, 50));
      const dataUrl = await toJpeg(paperEl, { 
        quality: 1, 
        backgroundColor: '#ffffff',
        width: 800,
        height: paperEl.scrollHeight,
        pixelRatio: 2 // High res
      });
      const link = document.createElement('a');
      link.download = `Invoice-${data.details.invoiceNumber || 'draft'}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to generate JPG. Please use PDF.');
    } finally {
      // Restore styles
      paperEl.style.transform = '';
      paperEl.style.transformOrigin = '';
      paperEl.style.width = '';
    }
  };

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
        className="full-preview-backdrop animate-fade-in"
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100dvh',
          backgroundColor: 'rgba(15, 23, 42, 0.45)', // Glassy blur mode
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          transition: 'opacity 0.3s ease',
          overflow: 'hidden'
        }}
      >
        {/* Dashboard Top Action Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          color: 'white',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 500 }}>
              <X size={20} /> Back to Edit
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            <span style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>Preview Dashboard</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Share Buttons */}
            <button className="btn" style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#25D366', border: '1px solid rgba(37, 211, 102, 0.3)', padding: '0 18px', height: '42px', borderRadius: '99px', backdropFilter: 'blur(10px)' }} onClick={() => handleShare('whatsapp')}>
              <MessageCircle size={18} style={{ marginRight: '8px' }} /> WhatsApp
            </button>
            <button className="btn" style={{ background: 'rgba(0, 132, 255, 0.15)', color: '#4facfe', border: '1px solid rgba(0, 132, 255, 0.3)', padding: '0 18px', height: '42px', borderRadius: '99px', backdropFilter: 'blur(10px)' }} onClick={() => handleShare('messenger')}>
              <MessageSquare size={18} style={{ marginRight: '8px' }} /> Messenger
            </button>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', padding: '0 18px', height: '42px', borderRadius: '99px', backdropFilter: 'blur(10px)' }} onClick={() => handleShare('email')}>
              <Mail size={18} style={{ marginRight: '8px' }} /> Email
            </button>
            
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.15)', margin: '0 8px' }} />
            
            {/* Download Buttons */}
            <button className="btn" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', padding: '0 18px', height: '42px', borderRadius: '99px', backdropFilter: 'blur(10px)' }} onClick={handleDownloadJPG}>
              <ImageIcon size={18} style={{ marginRight: '8px' }} /> JPG
            </button>
            <button className="btn btn-primary" onClick={onDownloadPDF} style={{ padding: '0 24px', height: '42px', borderRadius: '99px', boxShadow: '0 4px 15px rgba(0, 166, 90, 0.3)' }}>
              <Download size={18} style={{ marginRight: '8px' }} /> Download PDF
            </button>
          </div>
        </div>

        <div 
          ref={modalRef}
          className="animate-preview-modal"
          style={{
            flex: 1,
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            padding: '24px'
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
            <div style={{ width: '48px', height: '5px', backgroundColor: 'var(--color-border-hover)', borderRadius: '3px' }} />
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
                  {/* Zoom Toolbar overlay */}
                  <div className="desktop-only" style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    gap: '12px',
                    zIndex: 10,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '99px',
                    color: 'white'
                  }}>
                    <button aria-label="Zoom Out" onClick={() => zoomOut(0.25)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
                      <ZoomOut size={18} />
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: 500, minWidth: '40px', textAlign: 'center' }}>
                      {Math.round(state.scale * 100)}%
                    </span>
                    <button aria-label="Zoom In" onClick={() => zoomIn(0.25)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
                      <ZoomIn size={18} />
                    </button>
                    <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                    <button aria-label="Fit Width" onClick={handleFitWidth} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}>
                      <Maximize size={14} /> Fit
                    </button>
                  </div>

                  {/* Mobile Actions Overlay */}
                  <div className="mobile-only" style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    padding: 'var(--space-4) var(--space-4) var(--space-6) var(--space-4)', 
                    zIndex: 10,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 80%, transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                      <button className="btn" style={{ flexShrink: 0, background: '#25D366', color: 'white', border: 'none', padding: '0 16px', height: '44px', borderRadius: '99px' }} onClick={() => handleShare('whatsapp')}>
                        <MessageCircle size={18} style={{ marginRight: '6px' }} /> WhatsApp
                      </button>
                      <button className="btn" style={{ flexShrink: 0, background: '#0084FF', color: 'white', border: 'none', padding: '0 16px', height: '44px', borderRadius: '99px' }} onClick={() => handleShare('messenger')}>
                        <MessageSquare size={18} style={{ marginRight: '6px' }} /> Messenger
                      </button>
                      <button className="btn" style={{ flexShrink: 0, background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '0 16px', height: '44px', borderRadius: '99px' }} onClick={handleDownloadJPG}>
                        <ImageIcon size={18} style={{ marginRight: '6px' }} /> JPG
                      </button>
                    </div>
                     <button className="btn btn-primary" onClick={onDownloadPDF} style={{ padding: '0 var(--space-6)', height: '52px', width: '100%', borderRadius: '99px', fontSize: 'var(--text-base)', boxShadow: '0 8px 20px rgba(0, 102, 255, 0.3)' }}>
                      <Download size={20} style={{ marginRight: 'var(--space-2)' }} /> Download PDF
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
                      overflow: 'hidden'
                    }}
                  >
                    <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ padding: 'var(--space-10)' }}>
                      <div 
                        id="preview-paper-wrapper"
                        style={{ 
                          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
                          borderRadius: '2px', // Minimal paper radius
                          overflow: 'hidden',
                          backgroundColor: '#ffffff'
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
