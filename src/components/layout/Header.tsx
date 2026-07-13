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
          <a href="/" className="flex items-center gap-2 logo-link">
            <Logo size={32} hideText={true} />
            <span className="desktop-only header-wordmark">
              Invoice-Gen.net
            </span>
          </a>
        </div>

        {/* Center Section: Segmented Navigation */}
        <div className="flex items-center" style={{ justifyContent: 'center' }}>
          <div className="segmented-control">
            <button 
              onClick={() => onViewChange('editor')}
              className={`segmented-nav-btn ${activeView === 'editor' ? 'active' : ''}`}
            >
              Editor
            </button>
            <button 
              onClick={() => onViewChange('history')}
              className={`segmented-nav-btn ${activeView === 'history' ? 'active' : ''}`}
            >
              History
            </button>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center justify-end gap-3">
          <div className="desktop-only flex items-center gap-2">
            {activeView === 'editor' && onDownloadPDF && (
              <button 
                className="btn btn-sm btn-primary header-pdf-btn" 
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
              aria-label="More options"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreVertical size={18} className="text-secondary" />
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
