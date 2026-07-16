import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, MessageCircle, Mail, MessageSquare, Image as ImageIcon, Share2 } from 'lucide-react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  
  // Calculate perfect fit scale
  const [scale, setScale] = useState(0.8);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Handle ESC and Click Outside
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      const handleClickOutside = (e: MouseEvent) => {
        if (showShareMenu && shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
          setShowShareMenu(false);
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose, showShareMenu]);

  // Dynamic static sizing to perfectly fit screen
  useEffect(() => {
    const updateScale = () => {
      if (isOpen) {
        const isMobile = window.innerWidth <= 768;
        const paddingX = isMobile ? 32 : 120;
        const paddingY = isMobile ? 180 : 160; 
        
        const availableWidth = window.innerWidth - paddingX;
        const availableHeight = window.innerHeight - paddingY;
        
        const scaleByWidth = availableWidth / 800;
        const scaleByHeight = availableHeight / 1131; 
        
        const targetScale = Math.min(scaleByWidth, scaleByHeight, 1.2);
        setScale(targetScale);
      }
    };
    
    if (isOpen) {
      updateScale();
      window.addEventListener('resize', updateScale);
      return () => window.removeEventListener('resize', updateScale);
    }
  }, [isOpen]);

  const handleShare = async (platform: 'system' | 'whatsapp' | 'email' | 'messenger') => {
    setShowShareMenu(false);
    const text = `Invoice ${data.details.invoiceNumber || ''} for ${data.totals.total} ${data.details.currency} from ${data.business.name || 'our business'}`;
    
    if (platform === 'system' && navigator.share) {
      try {
        await navigator.share({ title: 'Invoice', text });
        return;
      } catch (err) {
        console.log('Native share failed or was cancelled', err);
      }
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'email') {
      window.open(`mailto:?subject=${encodeURIComponent('Invoice from ' + (data.business.name || 'Us'))}&body=${encodeURIComponent(text + '\n\nPlease find attached or linked invoice.')}`, '_blank');
    } else if (platform === 'messenger') {
      alert('To share via Messenger on desktop, please download the PDF or JPG and attach it.');
    }
  };

  const handleDownloadJPG = async () => {
    const paperEl = document.getElementById('preview-paper-wrapper');
    if (!paperEl) return;
    
    const originalTransform = paperEl.style.transform;
    const originalTransformOrigin = paperEl.style.transformOrigin;
    
    paperEl.style.transform = `scale(2)`;
    paperEl.style.transformOrigin = 'top left';
    
    try {
      await new Promise(r => setTimeout(r, 50));
      const dataUrl = await toJpeg(paperEl, { 
        quality: 1, 
        backgroundColor: '#ffffff',
        width: 800 * 2,
        height: 1131 * 2,
        pixelRatio: 1 
      });
      const link = document.createElement('a');
      link.download = `Invoice-${data.details.invoiceNumber || 'draft'}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to generate JPG. Please use PDF.');
    } finally {
      paperEl.style.transform = originalTransform;
      paperEl.style.transformOrigin = originalTransformOrigin;
    }
  };

  if (!isOpen) return null;

  const ShareMenu = ({ isMobile }: { isMobile?: boolean }) => (
    <div style={{
      position: 'absolute',
      [isMobile ? 'bottom' : 'top']: '100%',
      [isMobile ? 'left' : 'right']: 0,
      marginTop: isMobile ? 0 : '8px',
      marginBottom: isMobile ? '8px' : 0,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      minWidth: '200px',
      zIndex: 50,
      animation: 'fadeSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(${isMobile ? '10px' : '-10px'}); }
          to { opacity: 1; transform: translateY(0); }
        }
        .share-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          color: #E2E8F0;
          background: transparent;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s;
        }
        .share-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
      {Boolean(navigator.share) && /Mobi|Android/i.test(navigator.userAgent) && (
        <button className="share-item" onClick={(e) => { e.stopPropagation(); handleShare('system'); }}>
          <Share2 size={16} /> System Share
        </button>
      )}
      <button className="share-item" onClick={(e) => { e.stopPropagation(); handleShare('whatsapp'); }}>
        <MessageCircle size={16} color="#25D366" /> WhatsApp
      </button>
      <button className="share-item" onClick={(e) => { e.stopPropagation(); handleShare('messenger'); }}>
        <MessageSquare size={16} color="#0084FF" /> Messenger
      </button>
      <button className="share-item" onClick={(e) => { e.stopPropagation(); handleShare('email'); }}>
        <Mail size={16} /> Email
      </button>
    </div>
  );

  return createPortal(
    <>
      <div 
        className="animate-fade-in"
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100dvh',
          backgroundColor: 'rgba(15, 23, 42, 0.25)', // Smooth, softer transparency
          backdropFilter: 'blur(6px)', // Smoother, lighter blur
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'opacity 0.3s ease',
          overflow: 'hidden'
        }}
      >
        {/* Floating Island Header (Desktop) */}
        <div className="desktop-only" style={{
          position: 'absolute',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 12px 12px 24px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '99px',
          color: 'white',
          zIndex: 20,
          width: 'calc(100% - 48px)',
          maxWidth: '800px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>
              <X size={18} /> Back to Edit
            </button>
            <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#E2E8F0', letterSpacing: '0.2px' }}>Preview Mode</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative' }} ref={shareMenuRef}>
              <button className="btn hover-lift" style={{ background: 'transparent', color: '#CBD5E1', border: 'none', padding: '0 16px', height: '36px', borderRadius: '99px', fontSize: '13px', fontWeight: 600 }} onClick={() => setShowShareMenu(!showShareMenu)} onMouseEnter={(e) => e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
                <Share2 size={16} style={{ marginRight: '6px' }} /> Share
              </button>
              {showShareMenu && <ShareMenu />}
            </div>
            <button className="btn hover-lift" style={{ background: 'transparent', color: '#CBD5E1', border: 'none', padding: '0 16px', height: '36px', borderRadius: '99px', fontSize: '13px', fontWeight: 600 }} onClick={handleDownloadJPG} onMouseEnter={(e) => e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
              <ImageIcon size={16} style={{ marginRight: '6px' }} /> JPG
            </button>
            <button className="btn btn-primary hover-lift" onClick={onDownloadPDF} style={{ padding: '0 20px', height: '36px', borderRadius: '99px', fontSize: '13px', fontWeight: 700, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>
              <Download size={16} style={{ marginRight: '6px' }} /> Download PDF
            </button>
          </div>
        </div>

        {/* Mobile Minimal Close Button */}
        <div className="mobile-only" style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          zIndex: 20
        }}>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(20px)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Mobile Actions Overlay */}
        <div className="mobile-only" style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          padding: '24px 16px', 
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <div style={{ position: 'relative', flex: 1 }} ref={shareMenuRef}>
              <button className="btn" style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', height: '52px', borderRadius: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }} onClick={() => setShowShareMenu(!showShareMenu)}>
                <Share2 size={20} />
              </button>
              {showShareMenu && <ShareMenu isMobile />}
            </div>
            <button className="btn btn-primary" onClick={onDownloadPDF} style={{ flex: 3, height: '52px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, boxShadow: '0 8px 20px rgba(0, 166, 90, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Download size={20} style={{ marginRight: '8px' }} /> Download PDF
            </button>
          </div>
        </div>

        {/* Static Paper Container */}
        <div 
          ref={containerRef}
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 10
          }}
        >
          <div 
            id="preview-paper-wrapper"
            style={{ 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 255, 255, 0.1)', 
              borderRadius: '4px',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out',
              animation: 'floatUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}>
            <style>{`
              @keyframes floatUp {
                from { opacity: 0; transform: translateY(30px) scale(${scale * 0.95}); }
                to { opacity: 1; transform: translateY(0) scale(${scale}); }
              }
            `}</style>
            <InvoiceA4Preview data={data} scale={1} />
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
