import React, { useState, useEffect, useRef } from 'react';
import { Download, MoreVertical, Trash2, FilePlus, Sparkles, LayoutTemplate, Settings as SettingsIcon, Mail, CheckCircle2, Eye, Loader2, AlertCircle } from 'lucide-react';
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
  saveStatus,
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

  const renderSaveStatus = () => {
    if (!saveStatus || saveStatus === 'idle') return null;
    
    if (saveStatus === 'saving') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B', fontWeight: 500 }} className="desktop-only">
          <Loader2 size={16} className="animate-spin" /> Saving...
        </div>
      );
    }
    
    if (saveStatus === 'error_draft' || saveStatus === 'error_profile') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#EF4444', fontWeight: 500 }} className="desktop-only">
          <AlertCircle size={16} /> Save Failed
        </div>
      );
    }

    if (saveStatus === 'success') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B', fontWeight: 500 }} className="desktop-only">
          <CheckCircle2 size={16} color="#10B981" /> Saved
        </div>
      );
    }
    
    return null;
  };

  return (
    <header className="app-header header-container">
      <div className="container header-grid" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
        {/* Left Section: Logo & Send via Email */}
        <div className="flex items-center gap-6">
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

          <div className="desktop-only">
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              color: '#334155',
              fontSize: '13px',
              fontWeight: 500,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              cursor: 'pointer'
            }}>
              <Mail size={14} color="#64748B" /> Send via Email
            </button>
          </div>
        </div>

        {/* Center Section: Empty spacing */}
        <div />

        {/* Right Section: Actions */}
        <div className="flex items-center justify-end gap-4">
          {renderSaveStatus()}

          <div className="desktop-only flex items-center gap-2">
            <button 
              onClick={() => activeView === 'editor' ? onViewChange('history') : onViewChange('editor')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 500,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                cursor: 'pointer'
              }}
            >
              {activeView === 'editor' ? (
                <><Eye size={14} color="#64748B" /> Preview</>
              ) : (
                <><LayoutTemplate size={14} color="#64748B" /> Editor</>
              )}
            </button>
          </div>

          {/* Meatball Menu */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button 
              className="btn btn-ghost btn-icon" 
              style={{
                width: '32px',
                height: '32px',
                minHeight: '32px',
                borderRadius: '6px',
                color: '#0F172A',
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

          <div className="desktop-only flex items-center">
            {activeView === 'editor' && onDownloadPDF && (
              <button 
                className="btn btn-primary" 
                style={{
                  background: '#2563EB',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '0 18px',
                  height: '36px',
                  minHeight: '36px',
                  fontSize: '13px',
                  fontWeight: 600,
                  boxShadow: '0 1px 2px rgba(37,99,235,0.1)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
                onClick={onDownloadPDF}
              >
                <Download size={16} /> Download PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
