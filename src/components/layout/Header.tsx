import React, { useState, useEffect, useRef } from 'react';
import { Download, MoreVertical, Trash2, FilePlus } from 'lucide-react';
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
  hasLoadedHistory = false
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusDisplay = () => {
    if (saveStatus === 'saving') return { color: 'var(--color-text-secondary)', text: 'Saving...', dot: '#f59e0b' };
    if (saveStatus === 'error_draft') return { color: '#ef4444', text: 'Error saving draft', dot: '#ef4444' };
    if (saveStatus === 'error_profile') return { color: '#ef4444', text: 'Logo too large', dot: '#ef4444' };
    if (saveStatus === 'success') return { color: 'var(--color-text-secondary)', text: 'Saved locally', dot: 'var(--color-success)' };
    return { color: 'transparent', text: '', dot: 'transparent' };
  };

  const status = getStatusDisplay();

  return (
    <header style={{ 
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      zIndex: 100
    }} className="app-header">
      <div className="container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%', minWidth: 0, padding: '0 16px' }}>
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo size={28} color="var(--color-primary)" />
          <span className="font-bold text-base desktop-only" style={{ color: 'var(--color-text-main)', lineHeight: 1, letterSpacing: '-0.5px' }}>Invoice-Gen</span>
          
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginLeft: '24px', backgroundColor: 'var(--surface-100)', padding: '4px', borderRadius: '8px' }}>
            <button 
              onClick={() => onViewChange('editor')}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: activeView === 'editor' ? 600 : 500,
                color: activeView === 'editor' ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: activeView === 'editor' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                boxShadow: activeView === 'editor' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Editor
            </button>
            <button 
              onClick={() => onViewChange('history')}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: activeView === 'history' ? 600 : 500,
                color: activeView === 'history' ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: activeView === 'history' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                boxShadow: activeView === 'history' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              History
            </button>
          </div>

          {/* Toast Notification */}
          {showNewInvoiceToast && (
            <div style={{
              marginLeft: '12px',
              padding: '4px 8px',
              background: 'rgba(21, 94, 239, 0.1)',
              color: 'var(--color-primary)',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              animation: 'fadeIn 0.3s ease'
            }}>
              <InfoIcon size={14} /> Business details preserved
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Status Indicator */}
          {saveStatus !== 'idle' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: status.color, fontWeight: 500 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: status.dot, display: 'inline-block' }}></span>
              <span className="desktop-only">{status.text}</span>
            </div>
          )}

          {/* Desktop Actions */}
          <div className="desktop-only" style={{ display: 'flex', gap: '8px' }}>
            {activeView === 'editor' && (
              <>
                <button className="btn btn-outline btn-sm" onClick={onSave}>
                  Save
                </button>
                {hasLoadedHistory && onSaveAsNew && (
                  <button className="btn btn-outline btn-sm" onClick={onSaveAsNew}>
                    Save As New
                  </button>
                )}
              </>
            )}
            {onNewInvoice && (
              <button className="btn btn-outline btn-sm" onClick={onNewInvoice}>
                New Invoice
              </button>
            )}
            {activeView === 'editor' && onDownloadPDF && (
              <button className="btn btn-primary btn-sm" onClick={onDownloadPDF}>
                <Download size={14} /> PDF
              </button>
            )}
          </div>

          {/* Mobile PDF Action */}
          {activeView === 'editor' && onDownloadPDF && (
            <button className="btn btn-primary btn-sm mobile-only" onClick={onDownloadPDF}>
              <Download size={14} /> PDF
            </button>
          )}

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
                gap: '4px'
              }}>
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
                {activeView === 'editor' && hasLoadedHistory && (
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
                      onSaveAsNew?.();
                    }}
                  >
                    <FilePlus size={14} /> Save As New
                  </button>
                )}
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
                    onNewInvoice?.();
                  }}
                >
                  <FilePlus size={14} /> New Invoice
                </button>
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
