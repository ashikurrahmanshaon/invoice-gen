import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, FileText, Loader2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import type { InvoiceData } from '../../types/invoice';
import { buildInvoicePDF } from '../../utils/pdfGenerator';
import { Document, Page, pdfjs } from 'react-pdf';

// Initialize PDF.js worker locally
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface FullPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvoiceData;
  onDownloadPDF: () => void;
}

export const FullPreviewModal: React.FC<FullPreviewModalProps> = ({ isOpen, onClose, data, onDownloadPDF }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(600); // Dynamic width based on container
  const [scale, setScale] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  const handleFit = () => {
    setScale(1);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      containerRef.current.scrollLeft = 0;
    }
  };

  // Handle PDF Generation & Blob URL lifecycle
  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
      return;
    }

    setHasError(false);
    setIsLoading(true);
    let active = true;
    
    // Generate new PDF blob
    const generatePdf = async () => {
      try {
        const doc = await buildInvoicePDF(data);
        if (!active) return;
        const blob = doc.output('blob');
        const newUrl = URL.createObjectURL(blob);
        setPdfUrl(newUrl);
      } catch (err) {
        if (!active) return;
        console.error('Failed to generate PDF preview:', err);
        setHasError(true);
        setIsLoading(false);
      }
    };
    
    generatePdf();

    // Cleanup on data change or unmount
    return () => {
      active = false;
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [isOpen, data]);

  // Handle ESC and Scroll lock
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

  // Dynamic sizing
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Leave some padding
        setPageWidth(Math.min(containerRef.current.clientWidth - 48, 800));
      }
    };
    
    if (isOpen) {
      // Small delay to ensure modal is rendered
      setTimeout(updateWidth, 50);
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <style>{`
        @media (max-width: 768px) {
          .full-preview-backdrop {
            padding: 0 !important;
          }
          .full-preview-card {
            height: 100dvh !important;
            max-height: 100dvh !important;
            border-radius: 0 !important;
            width: 100vw !important;
          }
        }
      `}</style>
      <div 
        className="full-preview-backdrop"
        data-testid="full-preview-overlay"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-title"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100dvh',
          backgroundColor: 'rgba(16, 24, 40, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 'var(--space-4)'
        }}
    >
      <div 
        ref={modalRef}
        className="card full-preview-card" 
        style={{
          width: '100%',
          maxWidth: '850px',
          height: '90vh',
          maxHeight: '1000px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          flexShrink: 0
        }}>
          <h2 id="preview-title" className="font-bold text-lg m-0" style={{ color: 'var(--color-text-main)' }}>
            Invoice Preview
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" style={{ padding: '0 16px', height: '36px' }} onClick={onDownloadPDF}>
              <Download size={16} style={{ marginRight: '8px' }} /> <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="btn btn-ghost"
              style={{ width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Close"
            >
              <X size={20} className="text-secondary" />
            </button>
          </div>
        </div>
        
        {/* Body (PDF Viewer) */}
        <div ref={containerRef} style={{ flex: 1, backgroundColor: '#EAECF0', position: 'relative', overflowY: 'auto', overscrollBehavior: 'contain' }}>
          
          {hasError ? (
            // Fallback UI
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '32px', textAlign: 'center'
            }}>
              <FileText size={48} className="text-secondary" style={{ marginBottom: '16px' }} />
              <h3 className="font-bold text-lg" style={{ marginBottom: '8px', color: 'var(--color-text-main)' }}>
                Preview not supported
              </h3>
              <p className="text-secondary" style={{ marginBottom: '24px', maxWidth: '300px' }}>
                Your browser cannot display the PDF inline. You can still download it or open it directly.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href={pdfUrl || '#'} target="_blank" rel="noreferrer" className="btn btn-outline">
                  Open PDF
                </a>
                <button className="btn btn-primary" onClick={onDownloadPDF}>
                  <Download size={16} style={{ marginRight: '8px' }} /> Download PDF
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ padding: '24px', minWidth: 'fit-content', minHeight: 'fit-content' }}>
                <div style={{ margin: '0 auto', width: 'fit-content' }}>
                  {pdfUrl && (
                    <Document
                      file={pdfUrl}
                      onLoadSuccess={() => setIsLoading(false)}
                      onLoadError={(err) => {
                        console.error("React-pdf failed to load document:", err);
                        setHasError(true);
                      }}
                      loading={
                        <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
                          <div style={{ 
                            width: pageWidth, 
                            height: pageWidth * 1.414, // A4 aspect ratio 
                            backgroundColor: 'var(--color-surface)', 
                            boxShadow: 'var(--shadow-md)',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '40px',
                            gap: '24px',
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                          }}>
                            {/* Header Skeleton */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                              <div style={{ width: '40%', height: '40px', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
                              <div style={{ width: '25%', height: '40px', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
                            </div>
                            {/* Lines Skeleton */}
                            <div style={{ width: '60%', height: '16px', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
                            <div style={{ width: '80%', height: '16px', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
                            <div style={{ width: '50%', height: '16px', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
                            {/* Table Skeleton */}
                            <div style={{ marginTop: '40px', width: '100%', height: '200px', backgroundColor: '#F1F5F9', borderRadius: '8px' }} />
                          </div>
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.9)', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                            <Loader2 className="animate-spin" size={32} style={{ color: 'var(--color-primary)' }} />
                            <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Rendering PDF...</span>
                          </div>
                        </div>
                      }
                    >
                      <Page 
                        pageNumber={1} 
                        width={pageWidth} 
                        scale={scale}
                        renderTextLayer={false} 
                        renderAnnotationLayer={false}
                        className="shadow-lg bg-white"
                      />
                    </Document>
                  )}
                </div>
              </div>
              
              {/* Floating Zoom Controls */}
              {pdfUrl && !isLoading && (
                <div style={{
                  position: 'fixed',
                  bottom: '24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--color-surface)',
                  padding: '6px',
                  borderRadius: '999px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)',
                  gap: '4px',
                  zIndex: 10
                }}>
                  <button onClick={handleZoomOut} className="btn btn-ghost" style={{ padding: '8px', borderRadius: '50%', minWidth: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Zoom out">
                    <ZoomOut size={18} className="text-secondary" />
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: '500', minWidth: '48px', textAlign: 'center', color: 'var(--color-text-main)' }}>
                    {scale === 1 ? 'Fit' : `${Math.round(scale * 100)}%`}
                  </span>
                  <button onClick={handleZoomIn} className="btn btn-ghost" style={{ padding: '8px', borderRadius: '50%', minWidth: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Zoom in">
                    <ZoomIn size={18} className="text-secondary" />
                  </button>
                  <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 4px' }} />
                  <button onClick={handleFit} className={`btn ${scale === 1 ? 'btn-secondary' : 'btn-ghost'}`} style={{ padding: '0 16px', height: '36px', borderRadius: '999px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', backgroundColor: scale === 1 ? 'var(--color-border)' : 'transparent' }} aria-label="Fit to screen">
                    <Maximize size={16} className={scale === 1 ? '' : 'text-secondary'} style={{ marginRight: '6px' }} />
                    Fit
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>,
    document.body
  );
};
