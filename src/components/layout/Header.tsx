import React, { useState, useEffect, useRef } from 'react';
import { Download, MoreVertical, Trash2, FilePlus, Sparkles, LayoutTemplate, Settings as SettingsIcon } from 'lucide-react';
import { Logo } from '../ui/Logo';
import type { SaveStatus } from '../../hooks/useAutoSave';

interface HeaderProps {
  onNewInvoice?: () => void;
  onChangeTemplate?: () => void;
  onResetEverything?: () => void;
  onDownloadPDF?: () => void;
  saveStatus?: SaveStatus;
  showNewInvoiceToast?: boolean;
  activeView: 'editor' | 'history' | 'settings';
  onViewChange: (view: 'editor' | 'history' | 'settings') => void;
  onSave?: () => void;
  onSaveAsNew?: () => void;
  hasLoadedHistory?: boolean;
  onLoadDemo?: () => void;
  currentStage?: number;
  isMobileView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNewInvoice, 
  onChangeTemplate,
  onResetEverything, 
  onDownloadPDF,
  activeView,
  onViewChange,
  onSaveAsNew,
  hasLoadedHistory = false,
  onLoadDemo
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

  return (
    <header className="app-header header-container">
      <div className="container header-grid">
        {/* Left Section: Logo & Wordmark */}
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2 logo-link" style={{ textDecoration: 'none' }}>
            <Logo size={28} hideText={true} />
            <span style={{ 
              fontSize: '15px', 
              fontWeight: 800, 
              color: '#0F172A', 
              letterSpacing: '-0.02em',
              fontFamily: 'Outfit, Inter, sans-serif'
            }} className="desktop-only header-wordmark">
              Invoice-Gen.net
            </span>
          </a>
        </div>

        {/* Center Section: Segmented Navigation */}
        <div className="flex items-center" style={{ justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            background: '#F1F5F9',
            padding: '4px',
            borderRadius: '8px',
            gap: '4px'
          }}>
            <button 
              onClick={() => onViewChange('editor')}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: activeView === 'editor' ? 600 : 500,
                background: activeView === 'editor' ? '#FFFFFF' : 'transparent',
                color: activeView === 'editor' ? '#0F172A' : '#64748B',
                boxShadow: activeView === 'editor' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Editor
            </button>
            <button 
              onClick={() => onViewChange('history')}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: activeView === 'history' ? 600 : 500,
                background: activeView === 'history' ? '#FFFFFF' : 'transparent',
                color: activeView === 'history' ? '#0F172A' : '#64748B',
                boxShadow: activeView === 'history' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              History
            </button>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center justify-end gap-2">
          <div className="desktop-only flex items-center">
            {activeView === 'editor' && onDownloadPDF && (
              <button 
                className="btn btn-primary" 
                style={{
                  background: '#2563EB',
                  color: 'white',
                  borderRadius: '6px',
                  padding: '0 16px',
                  height: '34px',
                  minHeight: '34px',
                  fontSize: '13px',
                  fontWeight: 600,
                  boxShadow: '0 1px 2px rgba(37,99,235,0.1)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onClick={onDownloadPDF}
              >
                <Download size={14} /> PDF
              </button>
            )}
          </div>

          {/* Meatball Menu */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button 
              className="btn btn-ghost btn-icon" 
              style={{
                width: '34px',
                height: '34px',
                minHeight: '34px',
                borderRadius: '6px',
                color: '#64748B',
                background: menuOpen ? '#F1F5F9' : 'transparent'
              }}
              aria-label="More options"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreVertical size={18} />
            </button>
            
            {menuOpen && (
              <div className="card header-dropdown-menu animate-scale-up">
                {activeView === 'editor' && onLoadDemo && (
                  <button className="dropdown-item" onClick={() => { setMenuOpen(false); onLoadDemo(); }}>
                    <Sparkles size={14} className="text-primary" /> Load Demo Data
                  </button>
                )}

                {activeView === 'editor' && onChangeTemplate && (
                  <button className="dropdown-item" onClick={() => { setMenuOpen(false); onChangeTemplate(); }}>
                    <LayoutTemplate size={14} className="text-secondary" /> Change Template
                  </button>
                )}

                {activeView === 'editor' && onDownloadPDF && (
                  <button className="dropdown-item mobile-only" onClick={() => { setMenuOpen(false); onDownloadPDF(); }}>
                    <Download size={14} /> Download PDF
                  </button>
                )}
                {hasLoadedHistory && onSaveAsNew && (
                  <button className="dropdown-item" onClick={() => { setMenuOpen(false); onSaveAsNew(); }}>
                    <FilePlus size={14} /> Save As New
                  </button>
                )}
                {activeView === 'editor' && onNewInvoice && (
                  <button className="dropdown-item" onClick={() => { setMenuOpen(false); onNewInvoice(); }}>
                    <FilePlus size={14} /> New Invoice
                  </button>
                )}
                <button className="dropdown-item" onClick={() => { setMenuOpen(false); onViewChange('settings'); }}>
                  <SettingsIcon size={14} className="text-secondary" /> Settings
                </button>
                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
                <button className="dropdown-item text-error" onClick={() => { setMenuOpen(false); onResetEverything?.(); }}>
                  <Trash2 size={14} /> Reset Everything
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
