import React, { useState, useRef, useEffect } from 'react';
import type { SaveStatus } from '../../hooks/useAutoSave';
import { useSettings } from '../../contexts/SettingsContext';
import { supportedLanguages } from '../../utils/languages';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
interface HeaderProps {
  onNewInvoice?: () => void;
  onChangeTemplate?: () => void;
  onResetEverything?: () => void;
  onDownloadPDF?: () => void;
  onOpenHelp?: () => void;
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
  onViewChange,
  onOpenHelp,
  isMobileView
}) => {
  const { t } = useTranslation();
  const { settings, updateNestedSetting } = useSettings();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    let current = settings.appearance.theme;
    if (current === 'system') {
      current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    updateNestedSetting('appearance', { theme: nextTheme });
  };

  const handleLanguageChange = (code: string) => {
    updateNestedSetting('localization', { language: code });
    setShowLangMenu(false);
  };

  const currentTheme = settings.appearance.theme === 'system' 
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : settings.appearance.theme;

  return (
    <>
      {/* Top thin dark bar */}
      <div style={{ height: '5px', backgroundColor: '#333333', width: '100%' }} />
      <header className="app-header" style={{ padding: '0 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0', height: '64px', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobileView ? 'center' : 'space-between', width: '100%', maxWidth: '1312px', margin: '0 auto' }}>
          
          {/* Left: Logo & Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => onViewChange('editor')}>
            {/* Premium Custom SVG Logo */}
            <svg width="32" height="36" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 166, 90, 0.2))' }}>
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
              
              {/* Blue accent lines glowing */}
              <rect x="-6" y="16" width="8" height="2.5" rx="1.25" fill="#0084FF" style={{ filter: 'drop-shadow(0px 0px 4px rgba(0, 132, 255, 0.6))' }}/>
              <rect x="-6" y="22" width="12" height="2.5" rx="1.25" fill="#0084FF" style={{ filter: 'drop-shadow(0px 0px 4px rgba(0, 132, 255, 0.6))' }}/>
              <rect x="-6" y="28" width="8" height="2.5" rx="1.25" fill="#0084FF" style={{ filter: 'drop-shadow(0px 0px 4px rgba(0, 132, 255, 0.6))' }}/>
            </svg>
            <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'Inter, sans-serif' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#333333', letterSpacing: '-0.5px' }}>Invoice-Gen</span>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#666666' }}>.net</span>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <button onClick={() => onViewChange('history')} style={{ background: 'none', border: 'none', fontSize: '14.5px', color: '#64748B', cursor: 'pointer', fontWeight: 500, padding: 0 }}>{t('header.history', 'History')}</button>
            <button onClick={() => onOpenHelp ? onOpenHelp() : null} style={{ background: 'none', border: 'none', fontSize: '14.5px', color: '#64748B', cursor: 'pointer', fontWeight: 500, padding: 0 }}>{t('header.guides', 'Guides')}</button>
          </div>

          {/* Right: Actions */}
          {!isMobileView && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Language Icon */}
                <div style={{ position: 'relative' }} ref={langMenuRef}>
                  <button 
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Globe size={20} />
                    <span style={{ fontSize: '14px', fontWeight: 500, textTransform: 'uppercase' }}>
                      {settings.localization.language.split('-')[0]}
                    </span>
                  </button>

                  {showLangMenu && (
                    <div className="header-dropdown-menu" style={{ 
                      background: 'var(--color-surface)', 
                      border: '1px solid var(--color-border)', 
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-modal)',
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}>
                      {supportedLanguages.map(lang => (
                        <button
                          key={lang.code}
                          className="dropdown-item"
                          onClick={() => handleLanguageChange(lang.code)}
                          style={{
                            fontWeight: settings.localization.language === lang.code ? 600 : 400,
                            backgroundColor: settings.localization.language === lang.code ? 'var(--color-background)' : 'transparent'
                          }}
                        >
                          {lang.nativeName}
                          <span style={{ color: 'var(--color-text-tertiary)', fontSize: '12px', marginLeft: 'auto' }}>
                            {lang.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Theme Toggle Icon (Sun/Moon) */}
                <button 
                  onClick={toggleTheme}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}
                  title="Toggle theme"
                >
                  {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button style={{ background: 'none', border: 'none', fontSize: '14.5px', color: '#64748B', cursor: 'pointer', fontWeight: 500, padding: 0 }}>{t('header.signIn', 'Sign In')}</button>
              </div>
              
              <button style={{ 
                backgroundColor: '#00A65A', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                padding: '8px 20px', 
                fontSize: '14.5px', 
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {t('header.signUp', 'Sign Up')}
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
