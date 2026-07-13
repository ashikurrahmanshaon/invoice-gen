import React, { useState, useEffect, useRef } from 'react';
import { Download, MoreVertical, Trash2, FilePlus, Sparkles } from 'lucide-react';
import { Logo } from '../ui/Logo';
import type { SaveStatus } from '../../hooks/useAutoSave';

interface HeaderProps {
  onNewInvoice?: () => void;
  onResetEverything?: () => void;
  onDownloadPDF?: () => void;
  saveStatus?: SaveStatus;
  showNewInvoiceToast?: boolean;
  activeView: 'editor' | 'history';
  onViewChange: (view: 'editor' | 'history') => void;
  onSave?: () => void;
  onSaveAsNew?: () => void;
  hasLoadedHistory?: boolean;
  onLoadDemo?: () => void;
  currentStage?: number;
  isMobileView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNewInvoice, 
  onResetEverything, 
  onDownloadPDF,
  saveStatus = 'idle',
  showNewInvoiceToast = false,
  activeView,
  onViewChange,
  onSave,
  onSaveAsNew,
  hasLoadedHistory = false,
  onLoadDemo,
  currentStage = 1,
  isMobileView = false
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const STAGE_LABELS = ['Business', 'Client', 'Items', 'Review'];
  const TOTAL_STAGES = 4;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusPill = () => {
    let bg = '#FFFFFF';
    let border = '1px solid #E2E8F0';
    let color = '#475569';
    let dotColor = '#10B981';
    let text = 'Secure Sandbox';

    if (saveStatus === 'saving') {
      dotColor = '#F59E0B';
      text = 'Saving...';
    } else if (saveStatus === 'success') {
      dotColor = '#10B981';
      text = 'Saved Locally';
    } else if (saveStatus.startsWith('error')) {
      dotColor = '#EF4444';
      color = '#B91C1C';
      text = saveStatus === 'error_profile' ? 'Logo too large' : 'Save Error';
    }

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        fontWeight: 600,
        color: color,
        backgroundColor: bg,
        padding: '4px 8px',
        borderRadius: '999px',
        border: border,
        transition: 'all 0.2s ease',
        lineHeight: 1
      }}>
        <span className="status-dot-pulse" style={{ color: dotColor, width: '6px', height: '6px', borderRadius: '50%', background: dotColor }}></span>
        <span>{text}</span>
      </div>
    );
  };

  return (
    <header style={{ 
      background: '#FFFFFF',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }} className="app-header">
      <div className="container header-grid">
        {/* Style block for Header self-contained classes */}
        <style>{`
          .status-dot-pulse {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: currentColor;
            display: inline-block;
            position: relative;
          }
          .status-dot-pulse::after {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 50%;
            border: 1.5px solid currentColor;
            opacity: 0;
            animation: pulse-ring 2.2s infinite ease-out;
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.6); opacity: 0; }
            50% { opacity: 0.45; }
            100% { transform: scale(1.6); opacity: 0; }
          }

          .segmented-nav-btn {
            padding: 4px 10px;
            fontSize: 12px;
            border: none;
            background-color: transparent;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 4px;
            line-height: 1.2;
          }
          .segmented-nav-btn.active {
            font-weight: 600;
            background-color: #FFFFFF;
            border: 1px solid var(--color-border);
            box-shadow: none;
          }
          .segmented-nav-btn:not(.active):hover {
            background-color: rgba(0, 0, 0, 0.04);
          }

          .header-pdf-btn {
            font-weight: 500 !important;
            font-size: 13px !important;
            height: 32px !important;
            border-radius: 6px !important;
            background: var(--color-primary) !important;
            border: none !important;
            color: #FFFFFF !important;
            transition: background 0.15s ease, transform 0.1s ease !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
          }
          .header-pdf-btn:hover {
            background: var(--color-primary-hover) !important;
          }
          .header-pdf-btn:active {
            transform: scale(0.98) !important;
          }

          .header-save-btn {
            font-weight: 500 !important;
            font-size: 13px !important;
            height: 32px !important;
            border-radius: 6px !important;
            background-color: #FFFFFF !important;
            border: 1px solid var(--color-border) !important;
            color: var(--color-text-main) !important;
            transition: all 0.15s ease !important;
            cursor: pointer !important;
          }
          .header-save-btn:hover {
            background-color: var(--color-background) !important;
            border-color: var(--color-border-hover) !important;
          }
          .header-save-btn:active {
            transform: scale(0.98) !important;
          }
        `}</style>

        {/* Left Section: Logo & Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px' }}>
          <Logo size={28} hideText={true} />
          <span className="desktop-only" style={{ 
            fontSize: '16px', 
            fontWeight: 800, 
            letterSpacing: '-0.03em', 
            color: '#0F172A', 
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center'
          }}>
            Invoice-Gen.net
          </span>
          
          {/* Mobile: Step Title + Progress Dots */}
          {isMobileView && activeView === 'editor' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '4px' }}>
              <span className="mobile-step-text" style={{ 
                fontSize: '14px', 
                fontWeight: 700, 
                color: 'var(--color-text-main)',
                letterSpacing: '-0.01em'
              }}>
                {STAGE_LABELS[currentStage - 1]}
              </span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {Array.from({ length: TOTAL_STAGES }).map((_, i) => (
                  <div key={i} style={{
                    width: i === currentStage - 1 ? '16px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i < currentStage ? 'var(--color-primary)' : '#E4E7EC',
                    opacity: i < currentStage - 1 ? 0.5 : 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                ))}
              </div>
            </div>
          )}
          
          {/* Toast Notification */}
          {showNewInvoiceToast && (
            <div style={{
              marginLeft: '8px',
              padding: '2px 6px',
              background: 'rgba(21, 94, 239, 0.08)',
              color: 'var(--color-primary)',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              animation: 'fadeIn 0.3s ease'
            }}>
              <InfoIcon size={12} /> Business details preserved
            </div>
          )}
        </div>

        {/* Center Section: Segmented Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '2px', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <button 
              onClick={() => onViewChange('editor')}
              className={`segmented-nav-btn ${activeView === 'editor' ? 'active' : ''}`}
              style={{
                color: activeView === 'editor' ? '#0F172A' : '#64748B',
                fontWeight: activeView === 'editor' ? 600 : 500
              }}
            >
              Editor
            </button>
            <button 
              onClick={() => onViewChange('history')}
              className={`segmented-nav-btn ${activeView === 'history' ? 'active' : ''}`}
              style={{
                color: activeView === 'history' ? '#0F172A' : '#64748B',
                fontWeight: activeView === 'history' ? 600 : 500
              }}
            >
              History
            </button>
          </div>
        </div>

        {/* Right Section: Status Indicator & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          {/* Unified Premium Status Pill */}
          <div className="desktop-only">
            {getStatusPill()}
          </div>

          {/* Action Buttons (Unified Responsive Design) */}
          <div className="desktop-only" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {activeView === 'editor' && (
              <button 
                className="btn btn-sm header-save-btn" 
                onClick={onSave}
              >
                Save
              </button>
            )}
            {activeView === 'editor' && onDownloadPDF && (
              <button 
                className="btn btn-sm header-pdf-btn" 
                onClick={onDownloadPDF}
              >
                <Download size={12} /> PDF
              </button>
            )}
          </div>

          {/* Meatball Menu (Both Desktop & Mobile for Reset) */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button 
              className="btn btn-ghost btn-icon" 
              aria-label="More options"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreVertical size={18} className="text-secondary" />
            </button>
            
            {menuOpen && (
              <div className="card" style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '180px',
                padding: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 1010
              }}>
                {activeView === 'editor' && onLoadDemo && (
                  <button 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      fontSize: '13px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      color: 'var(--color-text-main)'
                    }}
                    onClick={() => {
                      setMenuOpen(false);
                      onLoadDemo();
                    }}
                  >
                    <Sparkles size={14} className="text-primary" /> Load Demo Data
                  </button>
                )}
                {activeView === 'editor' && (
                  <button 
                    className="mobile-only"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      fontSize: '13px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      color: 'var(--color-text-main)'
                    }}
                    onClick={() => {
                      setMenuOpen(false);
                      onSave?.();
                    }}
                  >
                    <FilePlus size={14} /> Save
                  </button>
                )}
                {activeView === 'editor' && onDownloadPDF && (
                  <button 
                    className="mobile-only"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      fontSize: '13px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      color: 'var(--color-text-main)'
                    }}
                    onClick={() => {
                      setMenuOpen(false);
                      onDownloadPDF();
                    }}
                  >
                    <Download size={14} /> Download PDF
                  </button>
                )}
                {hasLoadedHistory && onSaveAsNew && (
                  <button 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      fontSize: '13px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      color: 'var(--color-text-main)'
                    }}
                    onClick={() => {
                      setMenuOpen(false);
                      onSaveAsNew();
                    }}
                  >
                    <FilePlus size={14} /> Save As New
                  </button>
                )}
                {onNewInvoice && (
                  <button 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      fontSize: '13px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      color: 'var(--color-text-main)'
                    }}
                    onClick={() => {
                      setMenuOpen(false);
                      onNewInvoice();
                    }}
                  >
                    <FilePlus size={14} /> New Invoice
                  </button>
                )}
                <button 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    fontSize: '13px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    color: '#ef4444'
                  }}
                  onClick={() => {
                    setMenuOpen(false);
                    onResetEverything?.();
                  }}
                >
                  <Trash2 size={14} /> Reset Everything
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};

// Helper inline icon for toast to avoid large imports
const InfoIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);
