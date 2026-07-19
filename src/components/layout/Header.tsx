import React, { useState } from 'react';
import type { SaveStatus } from '../../hooks/useAutoSave';
import { Clock, BookOpen, FileText, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface HeaderProps {
  onNewInvoice?: () => void;
  onResetEverything?: () => void;
  onDownloadPDF?: () => void;
  onOpenHelp?: () => void;
  saveStatus?: SaveStatus;
  showNewInvoiceToast?: boolean;
  activeView?: 'editor' | 'history' | 'settings';
  onViewChange?: (view: 'editor' | 'history' | 'settings') => void;
  onSave?: () => void;
  onSaveAsNew?: () => void;
  hasLoadedHistory?: boolean;
  onLoadDemo?: () => void;
  currentStage?: number;
  isMobileView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onViewChange,
  onOpenHelp,
  saveStatus,
  isMobileView
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      if (onViewChange) {
        onViewChange('editor');
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const isToolPage = ['/', '/purchase-order-generator', '/quote-generator', '/estimate-generator'].includes(location.pathname);

  return (
    <>
      <header className="app-header" style={{ padding: '0 24px', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)', height: '60px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000, transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobileView ? 'center' : 'space-between', width: '100%', maxWidth: '1360px', margin: '0 auto', padding: '0 8px' }}>
          
          {/* Left: Logo & Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={handleLogoClick} aria-label="Go to Homepage" role="button" tabIndex={0}>
            {/* Premium Custom SVG Logo */}
            <svg width="32" height="36" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 166, 90, 0.2))' }} role="img" aria-label="Invoice-Gen.net Logo">
              <defs>
                <linearGradient id="docGradient" x1="0" y1="0" x2="32" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00E676" />
                  <stop offset="1" stopColor="#00A65A" />
                </linearGradient>
                <linearGradient id="foldGradient" x1="16" y1="0" x2="32" y2="10" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00C853" />
                  <stop offset="1" stopColor="#007936" />
                </linearGradient>
              </defs>
              <path d="M14 0H28C30.2091 0 32 1.79086 32 4V32C32 34.2091 30.2091 36 28 36H4C1.79086 36 0 34.2091 0 32V10L14 0Z" fill="url(#docGradient)"/>
              <path d="M0 10H10C12.2091 10 14 8.20914 14 6V0L0 10Z" fill="url(#foldGradient)"/>
              
              <rect x="2" y="16" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9"/>
              <rect x="2" y="22" width="22" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9"/>
              <rect x="2" y="28" width="16" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9"/>
            </svg>
            <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'Inter, sans-serif' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-title)', letterSpacing: '-0.5px' }}>Invoice<span style={{ color: 'var(--color-primary)' }}>-Gen</span></span>
              <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>.net</span>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {saveStatus && saveStatus !== 'idle' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: saveStatus === 'success' ? '#00A65A' : 'var(--color-text-secondary)', marginRight: '16px', opacity: 1, animation: saveStatus === 'success' ? 'fadeOut 3s forwards' : 'none' }}>
                <style>{`@keyframes fadeOut { 0% { opacity: 1; } 70% { opacity: 1; } 100% { opacity: 0; } }`}</style>
                {saveStatus === 'saving' && <span style={{ opacity: 0.6 }}>Saving...</span>}
                {saveStatus === 'success' && <span>✓ Draft Saved</span>}
              </div>
            )}

            {/* Tools Dropdown */}
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setShowToolsMenu(true)}
              onMouseLeave={() => setShowToolsMenu(false)}
            >
              <button 
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', fontSize: '14.5px', color: 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600, padding: '8px 14px', borderRadius: '8px', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-main)'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <FileText size={16} />
                Tools
                <ChevronDown size={14} />
              </button>
              {showToolsMenu && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, minWidth: '220px',
                  background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '8px', zIndex: 1001
                }}>
                  <Link to="/" style={{ display: 'block', padding: '10px 14px', borderRadius: '8px', color: location.pathname === '/' ? 'var(--color-primary)' : 'var(--color-text-main)', fontWeight: location.pathname === '/' ? 600 : 500, fontSize: '14px', textDecoration: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >Invoice Generator</Link>
                  <Link to="/purchase-order-generator" style={{ display: 'block', padding: '10px 14px', borderRadius: '8px', color: location.pathname === '/purchase-order-generator' ? 'var(--color-primary)' : 'var(--color-text-main)', fontWeight: location.pathname === '/purchase-order-generator' ? 600 : 500, fontSize: '14px', textDecoration: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >Purchase Order Generator</Link>
                  <Link to="/quote-generator" style={{ display: 'block', padding: '10px 14px', borderRadius: '8px', color: location.pathname === '/quote-generator' ? 'var(--color-primary)' : 'var(--color-text-main)', fontWeight: location.pathname === '/quote-generator' ? 600 : 500, fontSize: '14px', textDecoration: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >Quote Generator</Link>
                  <Link to="/estimate-generator" style={{ display: 'block', padding: '10px 14px', borderRadius: '8px', color: location.pathname === '/estimate-generator' ? 'var(--color-primary)' : 'var(--color-text-main)', fontWeight: location.pathname === '/estimate-generator' ? 600 : 500, fontSize: '14px', textDecoration: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >Estimate Generator</Link>
                </div>
              )}
            </div>

            {isToolPage && (
              <>
                <button 
                  onClick={() => onViewChange ? onViewChange('history') : navigate('/')} 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', fontSize: '14.5px', color: 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600, padding: '8px 14px', borderRadius: '8px', transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-main)'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Clock size={16} />
                  {t('header.history', 'History')}
                </button>
                <button 
                  onClick={() => onOpenHelp ? onOpenHelp() : null} 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', fontSize: '14.5px', color: 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600, padding: '8px 14px', borderRadius: '8px', transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-main)'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <BookOpen size={16} />
                  {t('header.guides', 'Guides')}
                </button>
              </>
            )}
          </div>

          {/* Right: Blog link (no auth buttons) */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/blog" 
              style={{ fontSize: '14.5px', color: 'var(--color-text-secondary)', fontWeight: 600, textDecoration: 'none', padding: '8px 14px', borderRadius: '8px', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-main)'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Blog
            </Link>
            <Link to="/templates"
              style={{ fontSize: '14.5px', color: 'var(--color-text-secondary)', fontWeight: 600, textDecoration: 'none', padding: '8px 14px', borderRadius: '8px', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-main)'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Templates
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
