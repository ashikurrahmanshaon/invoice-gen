import React from 'react';
import type { SaveStatus } from '../../hooks/useAutoSave';
import { Clock, BookOpen, LogIn, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
import { useNavigate, useLocation } from 'react-router-dom';

export const Header: React.FC<HeaderProps> = ({ 
  onViewChange,
  onOpenHelp,
  isMobileView
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

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
          </div>

          {/* Right: Actions */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', fontSize: '14.5px', color: 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600, padding: '8px 18px', transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-main)'; e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                >
                  <LogIn size={16} />
                  {t('header.signIn', 'Sign In')}
                </button>
              </div>
              
              <button style={{ 
                display: 'flex', alignItems: 'center', gap: '6px',
                background: '#00A65A', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                padding: '9px 20px', 
                fontSize: '15px', 
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#009650'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#00A65A'; }}
              >
                <UserPlus size={16} />
                {t('header.signUp', 'Sign Up')}
              </button>
          </div>
        </div>
      </header>
    </>
  );
};
